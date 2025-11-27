// CLIME quiz → pouch builder bridge (kept simple)
function climeSendToPouchBuilder(quizResult) {
  try {
    var defaults = {
      caffeineMg: 150,
      focusLevel: "medium",
      balanceLevel: "medium",
      personaLabel: "Balanced Performer",
      personaSummary:
        "You do your best with smooth, steady energy that doesn\u2019t spike or crash.",
    };

    var payload = Object.assign({}, defaults, quizResult || {});
    localStorage.setItem("climeQuizResult", JSON.stringify(payload));
    window.location.href = "/products/custom-energy-pouch?from_quiz=1";
  } catch (e) {
    console.error("CLIME quiz handoff error:", e);
  }
}
