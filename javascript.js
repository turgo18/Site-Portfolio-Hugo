// ===== 1. Thème clair/sombre =====

// On récupère le bouton grâce à son id (celui écrit dans le HTML)
const boutonTheme = document.getElementById("theme-toggle");
// document.documentElement = la balise <html> (c'est elle qui portera data-theme)
const racine = document.documentElement;

// Fonction qui applique un thème ("light" ou "dark") et change l'icône du bouton
function appliquerTheme(theme) {
    if (theme === "light") {
        racine.setAttribute("data-theme", "light");  // active les variables du thème clair
        boutonTheme.textContent = "☾";               // propose de repasser en sombre
    } else {
        racine.removeAttribute("data-theme");        // retour aux variables de :root
        boutonTheme.textContent = "☀";               // propose de passer en clair
    }
}

// Au chargement : on lit le thème enregistré (null si c'est la première visite)
const themeEnregistre = localStorage.getItem("theme");
appliquerTheme(themeEnregistre || "dark");           // si null, on prend "dark"

// Au clic : on bascule et on enregistre le choix
boutonTheme.addEventListener("click", function () {
    const themeActuel = racine.getAttribute("data-theme");
    const nouveauTheme = themeActuel === "light" ? "dark" : "light";
    appliquerTheme(nouveauTheme);
    localStorage.setItem("theme", nouveauTheme);
});


// ===== 2. Navbar qui disparaît =====

const navbar = document.querySelector(".navbar");
let dernierScroll = 0;   // position de la page lors du dernier défilement

window.addEventListener("scroll", function () {
    const scrollActuel = window.scrollY;   // nombre de pixels déjà défilés depuis le haut

    // On descend ET on a dépassé 100px : on cache. Sinon : on montre.
    if (scrollActuel > dernierScroll && scrollActuel > 100) {
        navbar.classList.add("navbar-cachee");
    } else {
        navbar.classList.remove("navbar-cachee");
    }

    dernierScroll = scrollActuel;          // on mémorise pour la prochaine comparaison
});


// ===== 3. Apparition des cartes au défilement =====

const cartes = document.querySelectorAll(".card");   // TOUTES les cartes (une liste)

// On cache chaque carte au départ
cartes.forEach(function (carte) {
    carte.classList.add("cachee");
});

// L'observateur est prévenu quand une carte entre dans l'écran
const observateur = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (entree) {
        if (entree.isIntersecting) {                      // la carte est visible
            entree.target.classList.remove("cachee");     // elle apparaît (animation CSS)
            observateur.unobserve(entree.target);         // inutile de la surveiller encore
        }
    });
}, { threshold: 0.15 });   // déclenché quand 15 % de la carte est visible

cartes.forEach(function (carte) {
    observateur.observe(carte);
});


// ===== 4. Formulaire de contact =====

const formulaire = document.getElementById("formulaire-contact");
const champPrenom = document.getElementById("prenom");
const champEmail = document.getElementById("email");
const champMessage = document.getElementById("message");
const messageSucces = document.getElementById("message-succes");

// Affiche un message d'erreur sous un champ et le passe en rouge
function afficherErreur(champ, idErreur, texte) {
    document.getElementById(idErreur).textContent = texte;
    champ.parentElement.classList.add("invalide");    // parentElement = le <div class="champ">
}

// Efface l'erreur d'un champ
function effacerErreur(champ, idErreur) {
    document.getElementById(idErreur).textContent = "";
    champ.parentElement.classList.remove("invalide");
}

// Chaque fonction renvoie true si le champ est valide, false sinon
function verifierPrenom() {
    const valeur = champPrenom.value.trim();          // trim() retire les espaces au début et à la fin
    const motifPrenom = /^[A-Za-zÀ-ÿ' -]+$/;          // lettres (accents compris), apostrophe, espace, tiret

    if (valeur === "") {
        afficherErreur(champPrenom, "erreur-prenom", "Le prénom est obligatoire.");
        return false;
    }
    if (valeur.length < 2) {
        afficherErreur(champPrenom, "erreur-prenom", "Le prénom doit faire au moins 2 caractères.");
        return false;
    }
    if (!motifPrenom.test(valeur)) {
        afficherErreur(champPrenom, "erreur-prenom", "Le prénom ne doit contenir que des lettres.");
        return false;
    }
    effacerErreur(champPrenom, "erreur-prenom");
    return true;
}

function verifierEmail() {
    const valeur = champEmail.value.trim();
    const motifEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;   // quelquechose @ quelquechose . quelquechose

    if (valeur === "") {
        afficherErreur(champEmail, "erreur-email", "L'email est obligatoire.");
        return false;
    }
    if (!motifEmail.test(valeur)) {
        afficherErreur(champEmail, "erreur-email", "Entre un email valide (exemple : nom@domaine.fr).");
        return false;
    }
    effacerErreur(champEmail, "erreur-email");
    return true;
}

function verifierMessage() {
    const valeur = champMessage.value.trim();

    if (valeur === "") {
        afficherErreur(champMessage, "erreur-message", "Le message est obligatoire.");
        return false;
    }
    if (valeur.length < 10) {
        afficherErreur(champMessage, "erreur-message", "Le message doit faire au moins 10 caractères.");
        return false;
    }
    effacerErreur(champMessage, "erreur-message");
    return true;
}

// Vérification quand on QUITTE un champ ("blur")
champPrenom.addEventListener("blur", verifierPrenom);
champEmail.addEventListener("blur", verifierEmail);
champMessage.addEventListener("blur", verifierMessage);

// Dès qu'on retape dans le formulaire, le message de remerciement disparaît
formulaire.addEventListener("input", function () {
    messageSucces.hidden = true;
});

// À l'envoi du formulaire
formulaire.addEventListener("submit", function (evenement) {
    evenement.preventDefault();   // empêche le rechargement de la page (comportement par défaut)

    // On lance les 3 vérifications AVANT de les combiner, pour que toutes les erreurs s'affichent d'un coup
    const prenomOk = verifierPrenom();
    const emailOk = verifierEmail();
    const messageOk = verifierMessage();

    if (prenomOk && emailOk && messageOk) {
        messageSucces.hidden = false;   // on affiche le remerciement
        formulaire.reset();             // on vide les champs
    } else {
        messageSucces.hidden = true;
    }
});