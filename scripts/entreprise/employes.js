/***************************************************************
 * FICHIER : scripts/entreprise/employes.js
 * ARCHITECTURE : RP MANAGER — PRO 2026
 * MODULE : Gestion des employés
 * DESCRIPTION :
 *   - Liste des employés
 *   - Ajout / édition / suppression
 *   - Gestion des grades
 * AUTEUR : Stephen
 ***************************************************************/

let editingEmployeId = null;
let currentEntrepriseId = null;

/***************************************************************
 * INITIALISATION
 ***************************************************************/
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    currentEntrepriseId = params.get("id");

    if (!currentEntrepriseId) {
        alert("Aucune entreprise sélectionnée.");
        return;
    }

    loadGrades();
    loadEmployes();
});

/***************************************************************
 * CHARGEMENT DES GRADES
 ***************************************************************/
function loadGrades() {
    google.script.run
        .withSuccessHandler(grades => {
            const select = document.getElementById("emp-grade");
            select.innerHTML = "";

            grades.forEach(g => {
                const opt = document.createElement("option");
                opt.value = g.id;
                opt.textContent = g.nom;
                select.appendChild(opt);
            });
        })
        .withFailureHandler(err => console.error(err))
        .getEntrepriseGrades(currentEntrepriseId);
}

/***************************************************************
 * CHARGEMENT DES EMPLOYÉS
 ***************************************************************/
function loadEmployes() {
    google.script.run
        .withSuccessHandler(data => {
            const tbody = document.querySelector("#table-employes tbody");
            tbody.innerHTML = "";

            data.forEach(e => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${e.id}</td>
                    <td>${e.nom}</td>
                    <td>${e.identifiant}</td>
                    <td>${e.grade_nom}</td>
                    <td>${e.actif ? "Oui" : "Non"}</td>
                    <td>
                        <button onclick="editEmploye('${e.id}')">Modifier</button>
                        <button onclick="deleteEmploye('${e.id}')">Supprimer</button>
                    </td>
                `;

                tbody.appendChild(tr);
            });
        })
        .withFailureHandler(err => console.error(err))
        .getEntrepriseEmployes(currentEntrepriseId);
}

/***************************************************************
 * MODAL
 ***************************************************************/
function openEmployeModal() {
    editingEmployeId = null;

    document.getElementById("employe-modal-title").textContent = "Nouvel employé";
    document.getElementById("emp-nom").value = "";
    document.getElementById("emp-identifiant").value = "";
    document.getElementById("emp-grade").value = "";
    document.getElementById("emp-actif").value = "1";

    document.getElementById("employe-modal").classList.remove("hidden");
}

function closeEmployeModal() {
    document.getElementById("employe-modal").classList.add("hidden");
}

/***************************************************************
 * EDITION
 ***************************************************************/
function editEmploye(id) {
    google.script.run
        .withSuccessHandler(e => {
            editingEmployeId = id;

            document.getElementById("employe-modal-title").textContent = "Modifier employé";
            document.getElementById("emp-nom").value = e.nom;
            document.getElementById("emp-identifiant").value = e.identifiant;
            document.getElementById("emp-grade").value = e.grade_id;
            document.getElementById("emp-actif").value = e.actif ? "1" : "0";

            document.getElementById("employe-modal").classList.remove("hidden");
        })
        .withFailureHandler(err => console.error(err))
        .getEmployeById(id);
}

/***************************************************************
 * SAUVEGARDE
 ***************************************************************/
function saveEmploye() {
    const nom = document.getElementById("emp-nom").value;
    const identifiant = document.getElementById("emp-identifiant").value;
    const grade_id = document.getElementById("emp-grade").value;
    const actif = document.getElementById("emp-actif").value === "1";

    if (!nom || !identifiant || !grade_id) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
    }

    if (editingEmployeId) {
        google.script.run
            .withSuccessHandler(() => {
                closeEmployeModal();
                loadEmployes();
            })
            .withFailureHandler(err => console.error(err))
            .updateEmploye(editingEmployeId, nom, identifiant, grade_id, actif);
    } else {
        google.script.run
            .withSuccessHandler(() => {
                closeEmployeModal();
                loadEmployes();
            })
            .withFailureHandler(err => console.error(err))
            .createEmploye(currentEntrepriseId, nom, identifiant, grade_id, actif);
    }
}

/***************************************************************
 * SUPPRESSION
 ***************************************************************/
function deleteEmploye(id) {
    if (!confirm("Supprimer cet employé ?")) return;

    google.script.run
        .withSuccessHandler(() => loadEmployes())
        .withFailureHandler(err => console.error(err))
        .deleteEmploye(id);
}