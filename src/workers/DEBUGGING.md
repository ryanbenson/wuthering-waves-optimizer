# Optimizer Worker Debugging Guide

This guide helps you debug issues with the optimizer's web worker architecture.

## Architecture Overview

The optimizer uses a **producer-consumer pattern** with web workers:

1. **Generator Worker** (`generator.worker.ts`): Generates all possible echo loadout combinations
2. **Processor Workers** (`processor.worker.ts`): Multiple workers that process batches of loadouts in parallel
3. **Main Thread** (`Calculator.vue`): Coordinates workers, manages work queue, and maintains the result heap

```
Main Thread
    │
    ├─> Generator Worker (1 worker)
    │   └─> Generates loadouts in batches
    │       └─> Sends batches to main thread work queue
    │
    └─> Processor Workers (up to 5 workers)
        └─> Main thread distributes batches from queue
        └─> Workers process loadouts and return results
        └─> Main thread updates heap with top N results
```

## Common Issues and Solutions

### Issue 1: "DataCloneError: Failed to execute 'postMessage'"

**Symptoms:**

- Console error: `DataCloneError: Failed to execute 'postMessage' on 'Worker': #<Object> could not be cloned`
- Optimizer stops working after a few batches

**Causes:**

- Vue reactive proxies (Proxy objects) cannot be cloned
- Functions cannot be cloned
- Circular references in objects
- Non-serializable objects (e.g., Date, RegExp, Map, Set)

**Solutions:**

1. **Check for Vue reactive objects:**

   ```javascript
   // In Calculator.vue, ensure all data is serialized:
   const plainArray = Array.isArray(reactiveArray)
     ? [...reactiveArray]
     : reactiveArray;
   const plainObject = JSON.parse(JSON.stringify(reactiveObject));
   ```

2. **Remove functions from context:**

   ```javascript
   // Functions like getRotationById must be handled in main thread
   // Pre-process rotation data before sending to workers
   ```

3. **Use `serializeEchoes` helper:**

   ```javascript
   const serializedEchoes = serializeEchoes(echoes);
   // This extracts only necessary properties from echo objects
   ```

4. **Debug which property is causing issues:**
   - Check browser console for the exact property name
   - Use `structuredClone()` or `JSON.stringify()` to test individual properties
   - Look for Proxy objects, functions, or circular references

### Issue 2: "Optimizer processes 0 loadouts"

**Symptoms:**

- Progress shows "Processed 0 of X loadouts"
- Generator sends batches, but processor workers return no results

**Causes:**

- All loadouts are being filtered out (duplicates, min stats, invalid combinations)
- Processor workers are receiving invalid data
- Context is missing required properties

**Solutions:**

1. **Check processor worker logs:**

   ```javascript
   // Look for: "Processor worker: Batch X had Y errors"
   // Check: "Invalid batch received" or "Missing context"
   ```

2. **Verify context is complete:**
   - Ensure `createSerializableContext` includes all required properties
   - Check that `baseHp`, `baseAtk`, `baseDef` are numbers
   - Verify `weaponData`, `talentData`, `character` are present

3. **Check min stats requirements:**
   - If `minStats` array has requirements, many loadouts may be filtered
   - Try running without min stats to verify

4. **Verify loadout structure:**
   - Each loadout should be an array of echo objects
   - Each echo should have `echoId` and `echo` properties
   - Check generator worker is sending valid loadouts

### Issue 3: "All loadouts have identical echoIds"

**Symptoms:**

- All loadouts in a batch have the same echoIds
- Sample keys show: `['d5c0zro1os', 'd5c0zro1os', 'd5c0zro1os']`
- Only a few unique combinations found

**Causes:**

- `generateLoadouts` mutates the `combo` array reference
- Loadouts are not being cloned before adding to batch

**Solutions:**

1. **Ensure loadouts are cloned in generator worker:**

   ```javascript
   // CRITICAL: Clone the loadout array
   const clonedLoadout = JSON.parse(JSON.stringify(loadout));
   batch.push(clonedLoadout);
   ```

2. **Verify cloning is working:**
   - Check that each loadout in batch has different echoIds
   - Log first loadout's echoIds before sending batch

### Issue 4: "Heap is not updating / Results are incorrect"

**Symptoms:**

- Optimizer completes but shows wrong results
- Top result has lower targetValue than expected
- Results don't match production version

**Causes:**

- Heap sorting logic is incorrect
- Target value calculation is wrong
- Context data is incomplete or incorrect

**Solutions:**

1. **Check heap operations:**
   - Verify heap maintains min-heap property (smallest at index 0)
   - Ensure bubble-down logic is correct when replacing heap[0]
   - Check that final results are sorted descending

2. **Verify target value calculation:**
   - For "Stat" targets: Check `finalStats[targetObject]` is correct
   - For "Attack" targets: Verify damage calculation matches production
   - For "Rotation" targets: Check damage aggregation is summing correctly

3. **Compare context with production:**
   - Log `finalStats` for a known loadout
   - Compare `targetValue` calculation step-by-step
   - Verify all buffs are being applied correctly

### Issue 5: "Workers are not processing batches"

**Symptoms:**

- Batches are queued but not processed
- Workers show as "ready" but never receive work
- `distributeWork` is called but no work is distributed

**Causes:**

- Workers not initialized properly
- `workerBusy` Map not tracking state correctly
- Work queue is empty when `distributeWork` is called

**Solutions:**

1. **Check worker initialization:**

   ```javascript
   // Verify all workers send "ready" message
   // Check readyWorkers count matches processorWorkers.length
   ```

2. **Verify work distribution:**
   - Log when batches are added to queue
   - Log when `distributeWork` is called
   - Check `workerBusy.get(worker)` state

3. **Check for race conditions:**
   - Ensure `distributeWork` is called after workers are ready
   - Verify batches are added to queue before distribution

## Debugging Tools

### Enable Debug Logging

Add temporary console logs to track flow:

```javascript
// In generator.worker.ts
console.log(`Generator: Sending batch ${batch.length} loadouts`);

// In processor.worker.ts
console.log(
  `Processor: Received batch ${batchId} with ${batch.length} loadouts`,
);
console.log(
  `Processor: Processed ${results.length} results from ${batch.length} loadouts`,
);

// In Calculator.vue
console.log(
  `Main: Received batch ${e.data.batchId} with ${e.data.results.length} results`,
);
console.log(
  `Main: Heap size: ${heap.length}, Top value: ${heap[0]?.targetValue}`,
);
```

### Inspect Worker Messages

Use browser DevTools to inspect worker messages:

1. Open DevTools → Sources tab
2. Find worker files in the file tree
3. Set breakpoints in `onmessage` handlers
4. Inspect `e.data` to see message structure

### Verify Data Serialization

Test if data can be cloned before sending:

```javascript
function testClone(data, name) {
  try {
    if (typeof structuredClone !== "undefined") {
      structuredClone(data);
      return true;
    }
    JSON.stringify(data);
    return true;
  } catch (error) {
    console.error(`Cannot clone ${name}:`, error);
    return false;
  }
}

// Test before sending
testClone(context, "context");
testClone(batch, "batch");
```

### Monitor Worker Performance

Track worker processing times:

```javascript
// In processor.worker.ts
const startTime = performance.now();
// ... process batch ...
const endTime = performance.now();
console.log(`Batch ${batchId} processed in ${endTime - startTime}ms`);
```

## Performance Tuning

### Adjust Worker Count

Default is 5 workers. Adjust based on device:

```javascript
// In Calculator.vue
const workerCount = navigator.hardwareConcurrency
  ? Math.min(5, navigator.hardwareConcurrency - 1)
  : 4;
```

### Adjust Batch Size

Larger batches = fewer messages but more memory:

```javascript
// In Calculator.vue
const batchSize = 5000; // Default
// Increase for faster devices, decrease for slower devices
```

### Optimize Heap Operations

For very large result sets, consider using a proper min-heap library instead of array sorting.

## Error Handling

### Generator Worker Errors

- Generator errors are caught and sent as "error" message
- Main thread should terminate workers and show error to user

### Processor Worker Errors

- Individual loadout errors don't stop batch processing
- Batch errors are logged and sent back to main thread
- Main thread should handle errors gracefully

### Main Thread Errors

- Worker creation errors should be caught
- Message sending errors should retry or queue work
- Heap operations should validate data before processing

## Testing Checklist

Before deploying, verify:

- [ ] Generator produces unique loadouts (no duplicates)
- [ ] Processor workers receive valid batches
- [ ] Context is complete and serializable
- [ ] Heap maintains correct order
- [ ] Results match production calculations
- [ ] Workers terminate properly on completion
- [ ] Error handling works for all failure modes
- [ ] Performance is acceptable (20-30s for 600K+ loadouts)

## Getting Help

If you encounter issues not covered here:

1. Check browser console for error messages
2. Enable debug logging (see above)
3. Inspect worker messages in DevTools
4. Compare with production version step-by-step
5. Check that all dependencies are up to date

## Key Files

- `src/workers/generator.worker.ts` - Loadout generation
- `src/workers/processor.worker.ts` - Loadout processing
- `src/components/Calculator.vue` - Main thread coordination
- `src/calculator/optimizer.ts` - Core optimization logic
- `src/calculator/attacks.ts` - Damage calculation
- `src/calculator/stats.ts` - Stat calculation
