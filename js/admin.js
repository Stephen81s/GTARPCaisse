console.log("%c[ADMIN] Initialisation…", "color:#3F51B5;font-weight:bold;");

async function chargerAdmin() {
    const { data: articles } = await supabase.from("articles").select("*");
    const { data: employes } = await supabase.from("employes").select("*");
    const { data: annuaire } = await supabase.from("annuaire").select("*");
    const { data: types } = await supabase.from("type_operations").select("*");
    const { data: moyens } = await supabase.from("moyens_paiement").select("*");
    const { data: resume } = await supabase.from("resume").select("*");
    const { data: compta } = await supabase.from("compta").select("*");

    afficherTable("admin-articles", articles);
    afficherTable("admin-employes", employes);
    afficherTable("admin-annuaire", annuaire);
    afficherTable("admin-types", types);
    afficherTable("admin-moyens", moyens);
    afficherTable("admin-resume", resume);
    afficherTable("admin-compta", compta);
}

function afficherTable(id, data) {
    const zone = document.getElementById(id);
    zone.innerHTML = "<pre>" + JSON.stringify(data, null, 2) + "</pre>";
}
