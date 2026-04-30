export const tuneBreakAttacks = {
  name: "Tune Break",
  description: `<div>When the target's <span style="color:#f7ca2f"><strong>Off-Tune Level</strong></span> is full, Hiyuki can cast <span style="color:#f7ca2f"><strong><span class="Highlight">Tune Break</span></strong></span> on the target.<br><br>While in <span style="color:#f7ca2f"><strong>Present Self</strong></span>, press or hold <span style="color:#f7ca2f"><strong>Normal Attack</strong></span> shortly after casting <span style="color:#f7ca2f"><strong><span class="Highlight">Tune Break</span></strong></span> to cast <span style="color:#f7ca2f"><strong>Basic Attack - Present Self Stage 3</strong></span>.<br>While in <span style="color:#f7ca2f"><strong>Foreclaimed Self</strong></span>, press <span style="color:#f7ca2f"><strong>Normal Attack</strong></span> shortly after casting <span style="color:#f7ca2f"><strong><span class="Highlight">Tune Break</span></strong></span> to cast <span style="color:#f7ca2f"><strong>Basic Attack - Foreclaimed Self Stage 3</strong></span>.</div>`,
  attacks: [
    {
      key: "TuneBreakDMG",
      label: "Tune Break DMG",
      type: "TuneBreak",
      talent: "1600.00%",
    },
  ],
};
