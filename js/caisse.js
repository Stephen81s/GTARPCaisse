console.log("%c[CAISSE] Initialisation…", "color:#FF9800;font-weight:bold;");

async function chargerCaisse() {
    logInfo("Chargement des données Supabase…");

    const { data: articles } = await supabase.from("articles").select("*");
    const { data: employes } = await supabase.from("employes").select("*");
    const { data: moyens } = await supabase.from("moyens_paiement").select("*");
    const { data: types } = await supabase.from("type_operations").select("*");

    afficherArticles(articles);
    afficherEmployes(employes);
    afficherPaiements(moyens);
    afficherTypes(types);

    logSuccess("Caisse prête !");
}

function afficherArticles(list) {
    const zone = document.getElementById("liste-articles");
    zone.innerHTML = "";

    list.forEach(a => {
        const btn = document.createElement("button");
        btn.className = "article-btn";
        btn.textContent = `${a.nom} (${a.prix}€)`;
        btn.onclick = () => ajouterArticle(a);
        zone.appendChild(btn);
    });
}

function ajouterArticle(article) {
    const zone = document.getElementById("ticket");
    const li = document.createElement("li");
    li.textContent = `${article.nom} — ${article.prix}€`;
    zone.appendChild(li);
}

async function validerTicket() {
    const employe = document.getElementById("select-employe").value;
    const client = document.getElementById("input-client").value;
    const type = document.getElementById("select-type").value;
    const paiement = document.getElementById("select-paiement").value;
    const total = calculerTotal();

    const { error } = await supabase.from("compta").insert({
        employe,
        client,
        type_operation: type,
        paiement,
        total
    });

    if (error) {
        logError("Erreur enregistrement : " + error.message);
    } else {
        logSuccess("Ticket enregistré !");
        document.getElementById("ticket").innerHTML = "";
    }
}

function calculerTotal() {
    const items = document.querySelectorAll("#ticket li");
    let total = 0;

    items.forEach(li => {
        const prix = parseFloat(li.textContent.split("—")[1]);
        total += prix;
    });

    return total;
}
