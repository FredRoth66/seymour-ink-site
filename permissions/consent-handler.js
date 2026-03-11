document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitConsent");

  submitBtn.addEventListener("click", () => {
    const data = {
      organization_id: "{{ORG_SLUG}}",
      logo_id: "{{LOGO_ID}}",

      order_permission: document.getElementById("order_permission").checked,
      future_sales: document.getElementById("future_sales").checked,
      additional_merch: document.getElementById("additional_merch").checked,
      derived_versions: document.getElementById("derived_versions").checked,

      signed_by: document.getElementById("signed_by").value,
      contact_email: document.getElementById("contact_email").value,
      signed_date: new Date().toISOString(),
      ip_address: "client-ip"
    };

    if (!data.order_permission || !data.credit_ack) {
      alert("Please complete all required fields.");
      return;
    }

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "consent.json";
    a.click();

    URL.revokeObjectURL(url);

    alert("Consent saved. Please send the downloaded file to Seymour.Ink.");
  });
});