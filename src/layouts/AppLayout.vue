<template>
  <div id="navbar-container"></div>
  <div class="contain">
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contain {
  display: grid;
  grid-template-columns: 1fr;

  @media (max-width: 768px) {
    display: block;
  }
}
</style>
