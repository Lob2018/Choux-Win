"use strict";

class Main {

    /**
     * CONSTRUCTEUR DU JEU GNOME
     * @param tps0 Compte à rebourd
     * @param score0 Score du joueur
     * @param QteChoux La quantité de choux à charger
     * @param QteMaires La quantité de maires à charger
     */
    constructor(tps0, score0, QteChoux, QteMaires) {
        /**
         * LANGUE UTILISÉE (RÉCUPÉRER LA TRADUCTION, LE LANGAGE STOCKÉ, METTRE À JOUR)
         */
        this.trad = trad;
        this.langue = this.getLangue();
        this.tradHTML();

        /**
         * Ajouter le texte de chargement
         */
        let el = document.getElementById("chargement");
        this.mijotage = document.createElement('P');
        this.mijotage.innerHTML = this.trad.chargement[this.langue];
        el.appendChild(this.mijotage);

        let o = this;
        /**
         * Bouton quitter
         */
        document.getElementById('fermer').addEventListener("click", function(evt) {
            window.api.send('envoi-fermer');
        })

        /**
         * Bouton réduire
         */
        document.getElementById('win').addEventListener("click", function(evt) {
            window.api.send('envoi-reduire');
        })

        /**
         * INFORMER AU SURVOL (TITLE) POUR LE MEILLEUR SCORE
         */
        document.getElementById('effScores').addEventListener("mouseenter", function(event) {
            o.infoMeilleurScore();
        }, false);

        /**
         * Bouton effacer les scores
         */
        document.getElementById('effScores').addEventListener("click", function(evt) {
            try {
                if (typeof localStorage === 'undefined') {} else {
                    window.localStorage.clear();
                    o.setLangue(o.langue);
                }
            } catch (e) {} finally {
                let eff = document.getElementById('effScores');
                eff.classList.remove("woow");
                eff.offsetWidth;
                eff.classList.add("woow");
            }
        })

        /**
         * Bouton crédits
         */
        this.copy = 1;
        document.getElementById('copy').addEventListener("click", function(event) {
            let cred = document.getElementById('copy');
            cred.classList.remove("woow");
            cred.offsetWidth;
            cred.classList.add("woow");
            o.copy == 0 ? o.copy = 1 : o.copy = 0;
        }, false);

        /**
         * maj ?
         */
        window.api.receive('retour-maj-dispo', (arg) => {
            if (arg.val == 0) {
                if (arg.rep.data[0].tag_name == undefined) {
                    document.getElementById('maj').style.display = "none";
                } else {
                    if (arg.version == arg.rep.data[0].tag_name.replace('v', '')) {} else
                        document.getElementById('maj').style.display = "block";
                }
            } else {
                // erreur ou pb connexion
                document.getElementById('maj').style.display = "none";
            }
        })

        // bouton pour récupérer la mise à jour
        document.getElementById('maj').addEventListener("click", function(evt) {
            let winEl = document.getElementById('maj');
            winEl.classList.remove("telecharger");
            winEl.offsetWidth;
            winEl.classList.add("telecharger");
            window.api.send('envoi-maj');
        })

        // bouton pour traduire
        document.getElementById('trad').addEventListener("click", function(evt) {
            let taille = o.trad.langages.length;
            let pos = o.trad.langages.indexOf(o.langue);
            // INCRÉMENTER
            pos == taille - 1 ? pos = 0 : pos++;
            // DÉFINIR NOUVEAU LANGAGE     
            o.langue = o.trad.langages[pos];
            let trad = document.getElementById("trad");
            trad.innerHTML = o.langue;
            o.setLangue(o.langue);
            // EFFET
            trad.classList.remove("woow");
            trad.offsetWidth;
            trad.classList.add("woow");
        })


        /**
         * INITIALISER
         */
        this.init(tps0, score0, QteChoux, QteMaires);
    }

    /**
     * NOMBRE D'IMAGES PAR SECONDE (30 fps)
     * @param o This
     */
    boucle(o) {
        o.fps = setInterval(function() {
            o.maj();
        }, 33);
        // }, parseInt(1000 / 30, 10));
    }


    /**
     * INIT DU JEU (POS | VIES | ETC)
     * @param tps0 Compte à rebourd
     * @param score0 Score du joueur
     * @param QteChoux La quantité de choux à charger
     * @param QteMaires La quantité de maires à charger
     */
    init(tps0, score0, QteChoux, QteMaires) {
        this.ttImages = 38;
        this.fps;
        this.police;
        this.ScaledPolice;
        this.ScaledPoliceNom;
        this.ScaledPoliceNomSens = 0;
        this.ratio;
        this.velo = 1;
        this.touche = 0;
        this.pauseMobile = false;
        this.padding = 10;
        this.audio;
        this.plateau;
        this.ctx;
        this.hero;
        this.score;
        this.scoreAffiche = 0;
        this.scoreTemporaire = 0;
        this.lgScore = 2500;
        this.gagne = false;
        this.tps;
        this.w;
        this.h;
        this.car;
        this.vite = false;
        // 3 ESSAIS
        this.vies = 2;
        this.niveau = new Array();
        // TIMER ONEUP ET TPS FIXE JEU EN SECONDE (1min)
        this.timerOneUp = null;
        this.tpdAffOneUp = 0;
        // TIMER REMONTE TPS DE 7s TOUTES LES 35s DE JEU
        this.timerRemonteTps = null;
        this.tpdAffRemonteTps = 0;
        this.remonte = 1;
        // TABLEAU DES VITESSES CONSTANTES
        this.vitesseNiveau = new Array();
        // INIT DE L'AUDIO
        this.audio = new Audio();
        // LOGIQUE DU JEU
        this.tps = this.car = this.tps0 = tps0;
        this.score = score0;
        // TXT SCORE
        this.angle = 0;
        this.tourne = false;
        // ELEMENTS
        this.NbreChoux = this.QteChoux = this.QteMontresDef = QteChoux;
        this.QteMaires = this.QteMairesDef = QteMaires;
        // MODE NORMAL OU EXTRA CHOU (FAUX POUR LE PERSO VISIBLE DU DÉBUT)
        this.normal = false;
        this.exChou;
        this.clignote;
        // AFFICHER LES REGLES
        this.timerMsgRegles;
        this.affMsgRegles = 0;
        // CURSEUR 0 vu 1 non
        this.curseur = 0;
        // CLAVIER 0 SOURIS 1 MANETTE 2
        this.clavierSouris = 1;
        // MEILLEURS SCORES ?
        this.meilleur = false;
        this.nomMeilleur = '';
        this.getMeilleur();
        // SCORE MAX POUR ENRICHISSEMENT DU PREMIER NIVEAU À PARTIR DE 10000
        this.enrichissement = 0;
        // TABLEAU DE POSITION DES LIMACES
        this.tabPosLimaces = new Array();
        // BLOQUER LE TEMPS QUAND COPYRIGHT AFFICHÉ
        this.tpsBloque = -1;
        this.charge();
        // PROGRESSION
        this.progression = 1;
    }

    /**
     * Informer sur le meilleur score avant effacement
     */
    infoMeilleurScore() {
        let txt = this.getNomScoreMeilleur();
        if (txt == '') {
            document.getElementById('effScores').setAttribute('title', this.trad.HtmlScoreVide[this.langue]);
        } else document.getElementById('effScores').setAttribute('title', this.trad.HtmlScoreSupp[this.langue] + txt);
    }

    /**
     * CHARGER LES RESSOURCES
     */
    charge() {
        /**
         * LA MUSIQUE ET LES SONS
         */
        this.audio.setMusique(["./media/LaSoupe.ogg", "./media/LaSoupe.mp3"]);
        this.audio.setOk(["./media/aah.ogg", "./media/aah.mp3"]);
        this.audio.setPb(["./media/boum.ogg", "./media/boum.mp3"]);
        this.audio.setVite(["./media/woodblock.ogg", "./media/woodblock.mp3"]);
        this.audio.setPerdu(["./media/loose.ogg", "./media/loose.mp3"]);
        this.audio.setGagne(["./media/win.ogg", "./media/win.mp3"]);
        this.audio.setScore(["./media/chou.ogg", "./media/chou.mp3"]);
        this.audio.setExChou(["./media/extraChou.ogg", "./media/extraChou.mp3"]);
        this.audio.setVie(["./media/vie.ogg", "./media/vie.mp3"]);
        this.audio.setMange(["./media/mange.ogg", "./media/mange.mp3"]);
        this.audio.setAccordeon(["./media/accordeon.ogg", "./media/accordeon.mp3"]);
        this.audio.setPain(["./media/pain.ogg", "./media/pain.mp3"]);
        this.audio.setKlaxon(["./media/klaxon.ogg", "./media/klaxon.mp3"]);
        this.audio.setAccident(["./media/accident.ogg", "./media/accident.mp3"]);
        this.audio.setRemonte(["./media/remonte.ogg", "./media/remonte.mp3"]);

        this.plateau = new Plateau(window.innerWidth - this.padding * 2, window.innerHeight - this.padding * 2)
        this.plateau.init(this, this.getRandomInt(this.ttImages), this.ttImages);
    }

    chargementImage(pct) {
        window.api.send('envoi-splash-fin');
        this.mijotage.innerHTML = this.trad.chargementPct[this.langue] + pct + "%";
    }

    /**
     * Quand toutes les images sont chargées
     */
    pret() {
        // RETIRER LE MESSAGE DE CHARGEMENT
        let el = document.getElementById("chargement");
        el.parentNode.removeChild(el);

        this.h = this.plateau.getHeight();
        this.w = this.plateau.getWidth();
        /**
         * LA TAILLE DE LA POLICE
         *
         */
        this.police = this.w / 14;
        /**
         *  LE RATIO (PIXELS A AJOUTER)
         */
        this.police > 15 ? this.ratio = parseInt((this.police - 14) / 3, 10) : this.ratio = 0;
        this.ScaledPolice = this.police;
        this.ScaledPoliceNom = this.police * 1.1;
        /**
         * LA VITESSE CORRESPONDANTE
         */
        this.vitesse = parseInt(2 + (this.ratio / 3), 10);
        /**
         * LE CONTEXTE
         */
        this.ctx = this.plateau.getCanvas().getContext('2d');
        this.plateau.getCanvas().style.padding = this.padding + "px";
        /**
         * LE TEXTE
         */
        this.leTexte();
        /**
         * INSTANCIER LE HEROS
         */
        this.hero = new PersoEl(['./img/hero.png', './img/heroEx.png', './img/heroDeb.png', './img/heroVie.png'], 65 + this.ratio, 20 + this.ratio, this.plateau, this.vitesse);
        /**
         * INSTANCIER LE ONE UP
         */
        this.oneUp = new PersoEl(['./img/heroEx.png', './img/heroDeb.png'], 65 + this.ratio, 20 + this.ratio, this.plateau, this.vitesse);
        /**
         * INSTANCIER REMONTER LE TEMPS
         */
        this.remonteTps = new RemonteTpsEl(['./img/remonteTps.png'], 32 + this.ratio, 32 + this.ratio, this.plateau, this.vitesse);
        /**
         * INFOS POUR LA SOURIS
         */
        this.cRect = this.ctx.canvas.getBoundingClientRect(); // récupérer le css
        this.cRectL = this.cRect.left + this.hero.getW() / 2;
        this.cRectT = this.cRect.top + this.hero.getH() / 2;
        /**
         * ECOUTEURS DU HERO (CLAVIER)
         */
        this.clavier(this);
        /**
         * CHARGER LE PREMIER NIVEAU
         */
        this.premierNiveau();
        this.enAttente = true;
        /**
         * EFFET INTRO + CHARGEMENT DE WAOUH
         */
        this.intro();
        this.plateau.getCanvas().classList.add("wow");
        document.getElementById("jeux").focus();
        this.boucle(this);
        /**
         *  INDICATION DE PROGRESSION
         */
        let ele = document.getElementById("progression");
        ele.style.width = this.w + 'px';
        // +10px PADDING CANVAS
        ele.style.left = this.cRect.left + 10 + 'px';
        // EFFET
        ele.classList.add("wow");
    }

    /**
     * CHARGER LE NIVEAU
     */
    premierNiveau() {
        // REINITIALISER
        this.niveau.splice(0, this.niveau.length);
        this.vitesseNiveau.splice(0, this.vitesseNiveau.length);
        this.tabPosLimaces.splice(0, this.tabPosLimaces.length);
        this.NbreChoux = this.QteChoux = this.QteMontresDef;
        this.QteMaires = this.QteMairesDef;
        this.car = this.tps = this.tps0;
        // INIT ONEUP        
        this.stopTimerOneUp();
        // POSITIONNER LE ONEUP
        let x = (this.getRandomInt(this.w - this.oneUp.getW()));
        let y = (this.getRandomInt(this.h - this.oneUp.getH()));
        this.oneUp.setPositionX(x);
        this.oneUp.setPositionY(y);

        // INIT REMONTE TPS        
        this.stopTimerRemonteTps();
        // POSITIONNER REMONTER LE TEMPS
        let a = (this.getRandomInt(this.w - this.remonteTps.getW()));
        let b = (this.getRandomInt(this.h - this.remonteTps.getH()));
        this.remonteTps.setPositionX(a);
        this.remonteTps.setPositionY(b);

        // INSTANCIER LES CHOUX+LES MAIRES ET LES PLACER
        for (let i = 0; i < Math.max(this.QteMaires, this.QteChoux); i++) {
            // ENRICHIR SINON
            if (this.enrichissement > 10000) {
                // NOK SATELLITE
                if (i == this.QteMaires - 1) {
                    this.nouvelElPremNiv('sat');
                }
                // NOK MAIRES
                if (i < this.QteMaires - 1) {
                    this.nouvelElPremNiv('maire');
                }
                // OK PAIN
                if (i == this.QteChoux - 2) {
                    this.nouvelElPremNiv('pain');
                }
                // OK EXTRACHOUX
                if (i == this.QteChoux - 1) {
                    this.nouvelElPremNiv('chouBacalan');
                }
                // OK CHOUX
                if (i < this.QteChoux - 2) {
                    this.nouvelElPremNiv('chou');
                }
            } else {
                // NOK MAIRES
                if (i < this.QteMaires) {
                    this.nouvelElPremNiv('maire');
                }
                // OK EXTRACHOUX
                if (i == this.QteChoux - 1) {
                    this.nouvelElPremNiv('chouBacalan');
                }
                // OK CHOUX
                if (i < this.QteChoux - 1) {
                    this.nouvelElPremNiv('chou');
                }
            }
        }
        /**
         * VÉRIFIER SI MAJ
         */
        window.api.send('envoi-maj-dispo');

        /**
         * TRADUIRE L'ICÔNE DE LA LANGUE EN HTML
         */
        let trad = document.getElementById("trad");
        trad.innerHTML = this.langue;
        // INDICATEUR DE PROGRÈS
        this.indProgress();
    }

    nouvelElPremNiv(type) {
        let ob;
        if (type == 'chou') ob = new ChouEl('./img/chou.png', 32 + this.ratio, 30 + this.ratio, this.plateau, 0, 0)
        else if (type == 'pain') ob = new PainEl('./img/pain.png', 29 + this.ratio, 30 + this.ratio, this.plateau, 0, 0)
        else if (type == 'maire') ob = new MaireEl('./img/cosmonaute.png', 28 + this.ratio, 32 + this.ratio, this.plateau, 0, 0)
        else if (type == 'sat') ob = new SatEl('./img/sat.png', 55 + this.ratio, 22 + this.ratio, this.plateau, 0, 0);
        else if (type == 'chouBacalan') ob = new ChouBacalanEl('./img/chou+.png', 53 + this.ratio, 30 + this.ratio, this.plateau, 0, 0);

        this.niveau.push(ob);
        this.positionner(ob, this.niveau.length - 1, true);
        // RÉCUPÉRER UNE VITESSE CONSTANTE POUR L'ÉLÉMENT
        this.ajouterVitesse();
    }

    /**
     * CHARGER UN NOUVEAU NIVEAU AVEC 1 CHOU ET 1 MAIRE EN PLUS SANS DEPASSER LE PLATEAU
     */
    nouveauNiveau() {
        let qte = this.plateau.getWidth() / (32 + this.ratio);

        if (this.QteMaires > qte) {} else {
            // AJOUTER UN PARAMÈTRE ALÉATOIRE À L'AJOUT
            let maires = this.getRandomInt(2);
            let sats = this.getRandomInt(2);
            let limaces; // À PARTIR DE 9500 -> LIMACES
            this.enrichissement > 9500 ? limaces = this.getRandomInt(2) : limaces = 0;
            //// LIMITER À UN ACCORDÉON ET À UN TRAFIC
            let indAcc = -1;
            let indTraf = -1;
            for (let i = 0; i < this.niveau.length; i++) {
                if (this.niveau[i].element.type == 'accordeon') {
                    indAcc = i;
                }
                if (this.niveau[i].element.type == 'trafic') {
                    indTraf = i;
                }
            }
            //// À PARTIR DE 12000 LIMITER À UN ACCORDÉON : L'AFFICHER OU AFFICHER UN CHOU À LA PLACE
            let accordeon;
            this.enrichissement > 12000 ? accordeon = this.getRandomInt(2) : accordeon = 0;
            if (indAcc == -1) {
                if (accordeon == 1) {
                    let acc = new AccordeonEl('./img/accordeon.png', 32 + this.ratio, 28 + this.ratio, this.plateau, 0, 0);
                    this.niveau.push(acc);
                }
            } else {
                if (accordeon == 0) {
                    let chou = new ChouEl('./img/chou.png', 32 + this.ratio, 30 + this.ratio, this.plateau, 0, 0);
                    this.niveau[indAcc] = chou;
                }
                // S'IL EXISTE NE PAS L'AJOUTER
                accordeon = 0;
            }
            //// À PARTIR DE 25000 LIMITER À UN TRAFIC : L'AFFICHER OU AFFICHER UN MAIRE À LA PLACE
            let trafic;
            this.enrichissement > 25000 ? trafic = this.getRandomInt(2) : trafic = 0;
            if (indTraf == -1) {
                if (trafic == 1) {
                    let traf = new TraficEl('./img/trafic.png', 96 + this.ratio, 60 + this.ratio, this.plateau, 0, 0);
                    this.niveau.push(traf);
                }
            } else {
                if (trafic == 0) {
                    let maire = new MaireEl('./img/cosmonaute.png', 28 + this.ratio, 32 + this.ratio, this.plateau, 0, 0)
                    this.niveau[indTraf] = maire;
                }
                // S'IL EXISTE NE PAS L'AJOUTER
                trafic = 0;
            }

            let choux = this.getRandomInt(2);
            let pains = this.getRandomInt(2);

            // GÉRER LES NIVEAUX 
            this.QteMaires += (maires + sats + limaces + trafic);
            this.QteChoux += (choux + pains + accordeon);
            if (this.QteChoux > qte - (qte / 4)) {
                this.car += 1;
            }

            // RÉCUPÉRER UNE VITESSE CONSTANTE POUR LES ÉLÉMENTS PUIS LES AJOUTER
            //NOK
            if (maires == 1) {
                let maire = new MaireEl('./img/cosmonaute.png', 28 + this.ratio, 32 + this.ratio, this.plateau, 0, 0)
                this.niveau.push(maire);
            }
            if (sats == 1) {
                let sat = new SatEl('./img/sat.png', 55 + this.ratio, 22 + this.ratio, this.plateau, 0, 0)
                this.niveau.push(sat);
            }
            if (limaces == 1) {
                let limace = new LimaceEl('./img/limace.png', 29 + this.ratio, 12 + this.ratio, this.plateau, 0, 0);
                this.niveau.push(limace);
                this.tabPosLimaces.push(this.niveau.length - 1);
            }
            // OK
            if (choux == 1) {
                let chou = new ChouEl('./img/chou.png', 32 + this.ratio, 30 + this.ratio, this.plateau, 0, 0);
                this.niveau.push(chou);
            }
            if (pains == 1) {
                let pain = new PainEl('./img/pain.png', 29 + this.ratio, 30 + this.ratio, this.plateau, 0, 0);
                this.niveau.push(pain);
            }
        }

        // DÉFINIR LA VITESSE
        // ACCÉLERER SI SCORE MAX > 50000
        for (let i = 0; i < this.niveau.length; i++) {
            //init
            if (this.vitesseNiveau[i] == undefined) this.vitesseNiveau.push(5);

            if (this.niveau[i].element.type == 'limace') {
                this.vitesseNiveau[i] = this.getRandomIntDeplace(2);
            } else if (this.niveau[i].element.type == 'trafic') {
                this.vitesseNiveau[i] = this.getRandomIntPlus(11, 19);
            } else {
                if (this.enrichissement > 50000) {
                    this.vitesseNiveau[i] = this.getRandomIntPlus(2, 6);
                } else {
                    this.vitesseNiveau[i] = this.getRandomIntDeplace(5);
                }
            }
        }
        // INDICATEUR DE PROGRÈS
        this.indProgress();
        // RECHARGER
        this.recharger();
    }

    // POSITIONNER AVEC LES COORDONNEES DISPONIBLES
    /**
     * @param o Objet à positionner
     * @param i Dans le cas de l'initialisation correspond à l'objet précédent
     * @param init Savoir si l'on est dans l'initialisation ou si tous les objets sont déjà positionnés
     */
    positionner(o, i, init) {
        // CONDITION DE SORTIE
        let test = false;
        while (!test) {
            // GENERER DES COORDONNEES
            let x = (this.getRandomInt(this.w - o.getW()));
            let y = (this.getRandomInt(this.h - o.getH()));
            // POSITIONNER LE NOUVEL OBJET
            o.setPositionX(x);
            o.setPositionY(y);
            // SAUF POUR LE TRAFIC
            if (o.element.type == 'trafic') {
                o.setPositionX(o.plateauW * 2.8);
                o.element.vu = false;
            }
            // TEST COLLISION AVEC LE HERO
            let ok = this.intersects(o, this.hero);
            // SI PAS DE COLLISION AVEC LE HERO
            if (!ok) {
                if (init) {
                    // TEST AVEC LES OBJETS -1 (VIENT D'ÊTRE AJOUTÉ)
                    if (this.niveau.length > 1) {
                        for (let j = 0; j < i; j++) {
                            if (this.intersects(o, this.niveau[j])) {
                                ok = false;
                                break;
                            } else ok = true;
                        }
                    } else ok = true;
                } else {
                    // TEST AVEC LES OBJETS SAUF CELUI-LÀ
                    for (let j = 0; j < this.niveau.length; j++) {
                        if (j === i) continue;
                        if (this.intersects(o, this.niveau[j])) {
                            ok = false;
                            break;
                        } else ok = true;
                    }
                }
            } // REPOSITIONNER SI COLLISION AVEC LE HERO
            else {
                ok = false;
            }
            test = ok;
        }
    }

    /**
     * AJOUTER VITESSE
     */
    ajouterVitesse() {
        // RÉCUPÉRER UNE VITESSE CONSTANTE POUR LES ÉLÉMENTS
        this.vitesseNiveau.push(this.getRandomIntDeplace(5));
    }

    /**
     * RECHARGER AVEC LA TOUCHE ESPACE
     */
    recharger() {
        // RAZ AUDIO
        this.audio.fadeInSupp();
        // RETIRER LE MSG DES RÈGLES
        this.affMsgRegles = 0;
        clearTimeout(this.timerMsgRegles);
        this.timerMsgRegles = undefined;
        // REPOSITIONNER
        for (let i = 0; i < this.niveau.length; i++) {
            this.positionner(this.niveau[i], i, false);
        }
    }

    /**
     * BOUCLE DU JEU
     */
    maj() {
        // VIDER
        this.clear();
        // FOND HORS/INTRO JEU
        if (this.tps <= 0 || this.enAttente) {
            if (this.copy == 1) this.ctx.globalAlpha = 0.3;
            this.avecCurseur();
        }

        this.ctx.drawImage(this.plateau.getFond(), 0, 0, this.plateau.getWidth(), this.plateau.getHeight());
        if (this.copy == 1) {
            if (this.tpsBloque == -1) {} else {
                this.tps = this.tpsBloque;
                this.tpsBloque = -1;
                let o = this;
                this.timer = setInterval(function() {
                    o.tempo();
                }, 1000);
                this.extraDebut();
            }
            // COLLISIONS
            this.collisions();

            // DESSINS DES ELEMENTS
            for (let i = 0; i < this.niveau.length; i++) {
                if (this.niveau[i].isVisible()) {
                    // CONSERVER DANS LE CANVAS
                    if (this.niveau[i].element.type == 'trafic') {
                        this.niveau[i].contenuUneFoisArrDr();
                        this.niveau[i].setPositionX(this.niveau[i].getPositionX() - this.vitesseNiveau[i]);
                    } else this.niveau[i].contenu();
                    // VITESS CONSTANTE VERS LE BAS OU VERS LE HAUT
                    if (this.normal) {
                        if (this.niveau[i].element.type == 'sat') {
                            if (this.remonte == 0) {
                                this.niveau[i].setPositionY(this.niveau[i].getPositionY() + this.vitesseNiveau[i]);
                            } else this.niveau[i].setPositionY(this.niveau[i].getPositionY() - this.vitesseNiveau[i]);
                        } else if (this.niveau[i].element.type == 'limace') {
                            if (this.remonte == 0) {
                                this.niveau[i].setPositionX(this.niveau[i].getPositionX() - this.vitesseNiveau[i]);
                            } else this.niveau[i].setPositionX(this.niveau[i].getPositionX() + this.vitesseNiveau[i]);
                        } else if (this.niveau[i].element.type == 'trafic') {
                            if (this.niveau[i].element.vu == false) {
                                this.audio.getKlaxon();
                                this.niveau[i].element.vu = true;
                            }
                        } else
                        if (this.remonte == 0) {
                            this.niveau[i].setPositionY(this.niveau[i].getPositionY() - this.vitesseNiveau[i]);
                        } else this.niveau[i].setPositionY(this.niveau[i].getPositionY() + this.vitesseNiveau[i]);
                    }

                    // VITESSE ALEATOIRE
                    //this.niveau[i].setPositionY(this.niveau[i].getPositionY() + this.getRandomIntDeplace(10)); 

                    // DESSINER                   
                    this.ctx.drawImage(this.niveau[i].getImage(), this.niveau[i].getPositionX(), this.niveau[i].getPositionY(), this.niveau[i].getW(), this.niveau[i].getH());

                }
            }

            // DESSINER ONEUP SI VIE < 2 ET APPARAIT EN FONCTION DU TEMPS
            this.leOneUp();

            // DESSINER REMONTE TEMPS APPARAIT EN FONCTION DU TEMPS
            this.remonterLeTps();

            // RETIRER L'OPACITE SI BESOIN
            this.ctx.globalAlpha = 1;

            // HERO
            this.hero.deplacer();
            if (this.clavierSouris == 1) {
                this.hero.sourisContenu();
            } else this.hero.contenu();

            if (this.tps > 0) this.ctx.drawImage(this.hero.getImage(), this.hero.getPositionX(), this.hero.getPositionY(), this.hero.getW(), this.hero.getH());

            // SCORE
            this.tourne ?
                this.animerTxtScore() :
                this.ctx.fillText((this.scoreAffiche < parseInt(this.score, 10) ? this.ajouter() : this.afficher()), this.police * 4, this.hero.getH() * 2);

            // IMG SCORE
            let lineW = this.ctx.measureText(this.score).width / 2;
            let lineH = this.ctx.measureText("8").width;
            this.ctx.font = (this.police / 1.5).toString() + "px FontAwesome";
            // FAIRE TOURNER LA CUILLERE
            this.ctx.save();
            if (this.tourne) {
                this.ctx.translate(this.police * 4 + lineW + lineH / 3, (this.hero.getH() * 2) - lineH / 8);
                this.ctx.rotate(this.angle > 360 ? this.angle = 0 : this.angle++);

            } else {
                this.ctx.translate(this.police * 4 + lineW, (this.hero.getH() * 2) - lineH / 8);
                this.ctx.rotate(0);
            }
            this.ctx.translate(-(this.police * 4 + lineW), -((this.hero.getH() * 2) - (lineH) / 8));
            // LA CUILLERE
            this.tourne ?
                this.ctx.fillText("\uf1b1", this.police * 4 + lineW, (this.hero.getH() * 2) - lineH / 8) :
                this.ctx.fillText("   \uf1b1", this.police * 4 + lineW, (this.hero.getH() * 2) - lineH / 8);
            this.ctx.restore();
            // CHANGER LA FONTE
            this.ctx.font = (this.police).toString() + "px Amatic";

            // INTRO OU GAGNE OU PERDU? + MEMORISATION
            if (this.NbreChoux === 0) {
                this.tps = "0";
                this.audio.getStopVite();
                this.ctx.fillText(this.trad.gagne[this.langue], this.w / 2, this.h / 2.5);
                // HAUTEUR DE LIGNE 
                let lineHeight = this.ctx.measureText('M').width * 2.4;
                this.ctx.fillText(this.getStorage(), this.w / 2, (this.h / 2.5) + lineHeight);
                if (this.getStorage().startsWith(this.trad.votreRecordEst[this.langue])) {
                    if (this.meilleur) {} else {
                        this.nomMeilleur = '';
                        this.meilleur = true;
                    }
                    this.animerTxtNom(lineHeight);
                    this.ctx.font = (this.police).toString() + "px Amatic";
                    this.ctx.fillText(this.nomMeilleur, this.w / 2, (this.h / 2.5) + lineHeight * 4);

                } else this.meilleur = false;
                if (this.getStorage().startsWith(this.trad.leRecordEst[this.langue])) {
                    this.ctx.fillText(this.nomMeilleur == '' ? this.trad.HtmlScoreAnon[this.langue] : this.trad.HtmlScoreRealPar[this.langue] + this.nomMeilleur, this.w / 2, (this.h / 2.5) + lineHeight * 3);
                }

                this.ctx.fillText(this.trad.clicAuCentreOu[this.langue], this.w / 2, this.h - this.hero.getH());
                this.gagne = true;
                this.setStorage();
            } else if (this.tps === this.car) {
                this.ctx.fillText(this.trad.preparezLaSoupe[this.langue], this.w / 2, this.h / 2);
                this.iconePeriph();
                this.ctx.fillText(this.trad.cliquezAuCentr[this.langue], this.w / 2, this.h - this.hero.getH());
            } else if (this.tps < 0) {
                this.audio.getStopVite();
                if (this.vies > 0 && this.hero.isVisible()) {
                    this.vies--;
                    this.tps = this.car;
                    this.vite = false;
                } else {
                    this.hero.setVisible(false);
                    this.msgIntro();
                    this.gagne = false;
                }
            }
            // CPTE A REBOURD
            else if (this.tps > 0) {
                this.sansCurseur();
                this.ctx.fillText(this.tps, this.w - this.police * 3, this.hero.getH() * 2);
            }
            // AFFICHER LES VIES
            if (this.vies == 2) {
                if (this.hero.isVisible()) {
                    this.ctx.drawImage(this.hero.getImagePos(0), this.w - this.police * 1, this.hero.getH(), this.hero.getW() / 2.5, this.hero.getH() / 2.5);
                    this.ctx.drawImage(this.hero.getImagePos(0), this.w - this.police * 1.65, this.hero.getH(), this.hero.getW() / 2.5, this.hero.getH() / 2.5);
                    this.ctx.drawImage(this.hero.getImage(), this.w - this.police * 2.3, this.hero.getH(), this.hero.getW() / 2.5, this.hero.getH() / 2.5);
                }
            } else if (this.vies == 1) {
                this.ctx.drawImage(this.hero.getImagePos(0), this.w - this.police * 1, this.hero.getH(), this.hero.getW() / 2.5, this.hero.getH() / 2.5);
                this.ctx.drawImage(this.hero.getImage(), this.w - this.police * 1.65, this.hero.getH(), this.hero.getW() / 2.5, this.hero.getH() / 2.5);
            } else this.ctx.drawImage(this.hero.getImage(), this.w - this.police * 1, this.hero.getH(), this.hero.getW() / 2.5, this.hero.getH() / 2.5);
        } else {
            if (this.tpsBloque == -1) {
                this.tpsBloque = this.tps;
                clearInterval(this.timer);
            }
            if (this.tps > 0) {
                this.ctx.drawImage(this.hero.getImagePos(3), this.hero.getPositionX(), this.hero.getPositionY(), this.hero.getW(), this.hero.getH());
                this.hero.sourisContenu();
            }
            this.ctx.font = (this.police / 2).toString() + "px Amatic";
            this.ctx.fillText(this.plateau.getCopy(this.trad.HtmlCopy[this.langue]), this.w / 2, this.h - this.hero.getH());
            this.ctx.font = (this.police).toString() + "px Amatic";
        }
    }

    /**
     * INCRÉMENTER LE SCORE
     */
    ajouter() {
        this.tourne = true;
        this.audio.getScore();
        return (this.scoreAffiche += 50).toString();
    }

    /**
     * AFFICHER LE SCORE
     */
    afficher() {
        this.tourne = false;
        this.enrichissement = this.score;
        return this.score;
    }

    /**
     * Animer le texte du score
     */
    animerTxtScore() {
        this.ScaledPolice > this.police * 1.2 ? this.ScaledPolice = this.police : this.ScaledPolice += 2;
        this.scoreAffiche > parseInt(this.score - 100, 10) ?
            this.ctx.font = (this.ScaledPolice).toString() + "px Amatic" :
            this.ctx.font = (this.police).toString() + "px Amatic";
        return this.ctx.fillText((this.scoreAffiche < parseInt(this.score, 10) ? this.ajouter() : this.afficher()), this.police * 4, this.hero.getH() * 2);
    }

    /**
     * Indiquer la progression
     */
    indProgress() {
        let el = document.getElementById("progression");
        el.style.display = "block";

        let max = this.plateau.getWidth() / (32 + this.ratio);
        if (this.QteMaires >= max) {
            el.setAttribute('value', 100);
            this.progression = 100;
        } else {
            this.progression = Math.floor((this.QteMaires / (this.plateau.getWidth() / (32 + this.ratio))) * 100)
            el.setAttribute('value', this.progression);
        }
    }

    /**
     * OneUp 3sec toutes les 1mn
     */
    leOneUp() {
        if (this.vies < 2 && this.tpdAffOneUp > 60) {
            let o = this;
            if (this.timerOneUp == null) {
                this.timerOneUp = setTimeout(
                    function() {
                        o.tpdAffOneUp = 0;
                        o.stopTimerOneUp();
                    }, 3000);
            } else {
                this.oneUp.setVisible(true);
                this.ctx.drawImage(this.oneUp.getImage(), this.oneUp.getPositionX(), this.oneUp.getPositionY(), this.oneUp.getW(), this.oneUp.getH());
            }
        } else this.oneUp.setVisible(false);
    }


    /**
     * Remonter le temps 3sec toutes les 35s
     */
    remonterLeTps() {
        if (this.tpdAffRemonteTps > 35) {
            let o = this;
            if (this.timerRemonteTps == null) {
                this.timerRemonteTps = setTimeout(
                    function() {
                        o.tpdAffRemonteTps = 0;
                        o.stopTimerRemonteTps();
                    }, 3000);
            } else {
                this.remonteTps.setVisible(true);
                this.ctx.drawImage(this.remonteTps.getImage(), this.remonteTps.getPositionX(), this.remonteTps.getPositionY(), this.remonteTps.getW(), this.remonteTps.getH());
            }
        } else this.remonteTps.setVisible(false);
    }


    /**
     * Animer le texte du nom
     */
    animerTxtNom(lineHeight) {
        if (this.ScaledPoliceNomSens == 0) {
            this.ScaledPoliceNom -= 0.1;
            if (this.ScaledPoliceNom < this.police * 0.95) this.ScaledPoliceNomSens = 1;
        } else if (this.ScaledPoliceNomSens == 1) {
            this.ScaledPoliceNom += 0.1;
            if (this.ScaledPoliceNom > this.police * 1.05) this.ScaledPoliceNomSens = 0;
        }
        this.ctx.font = (this.ScaledPoliceNom).toString() + "px Amatic";
        return this.ctx.fillText(this.trad.saisissezVotreNom[this.langue], this.w / 2, (this.h / 2.5) + lineHeight * 3);
    }

    /**
     * Afficher les règles après 3 secondes
     */
    msgIntro() {
        this.vies = 2;
        let o = this;
        if (this.timerMsgRegles === undefined) this.timerMsgRegles = setTimeout(
            function() {
                o.affMsgRegles = 1;
            }, 3000);
        if (this.affMsgRegles === 0) {
            let lineHeight = this.ctx.measureText('\uf150').width * 1.2;
            this.ctx.fillText(this.trad.perdu[this.langue], this.w / 2, this.h / 2);
            this.ctx.fillText(this.getStorage(), this.w / 2, (this.h / 2) + lineHeight * 2);
            if (this.getStorage().startsWith(this.trad.leRecordEst[this.langue])) {
                this.ctx.fillText(this.nomMeilleur == '' ? this.trad.unAnonDetient[this.langue] : this.nomMeilleur + this.trad.detientCeRecord[this.langue], this.w / 2, (this.h / 2) + lineHeight * 4);
            }
        } else {
            this.ctx.fillText(this.trad.preparezLaSoupe[this.langue], this.w / 2, this.h / 2);
            this.iconePeriph();
            this.ctx.fillText(this.trad.clicAuCentreOu[this.langue], this.w / 2, this.h - this.hero.getH());
        }
    }

    iconePeriph() {
        this.ctx.font = (this.police / 1.5).toString() + "px FontAwesome";
        let lineHeightAwe = this.ctx.measureText('\uf150').width * 2.4;
        this.ctx.fillText('\uf151', (this.w / 2) - lineHeightAwe * 2, this.h - this.hero.getH() - lineHeightAwe * 2.78);
        this.ctx.fillText('\uf191 \uf150 \uf152', (this.w / 2) - lineHeightAwe * 2, this.h - this.hero.getH() - lineHeightAwe * 2.25);
        this.ctx.font = (this.police * 1.3).toString() + "px FontAwesome";
        this.ctx.fillText('\uf11b', (this.w / 2), this.h - this.hero.getH() - lineHeightAwe * 2.4);
        this.ctx.font = (this.police).toString() + "px FontAwesome";
        this.ctx.fillText('\uf245', (this.w / 2) + lineHeightAwe * 2, this.h - this.hero.getH() - lineHeightAwe * 2.45);
        this.ctx.font = (this.police).toString() + "px Amatic";
    }

    /**
     * LES COLLISIONS DANS LE JEU
     */
    collisions() {
        // ONEUP
        if (this.hero.isVisible() && this.oneUp.isVisible() && this.intersects(this.hero, this.oneUp)) {
            this.vies += 1;
            this.audio.getVie();
            this.stopTimerOneUp();
            this.tpdAffOneUp = 0;
        }
        // REMONTE TPS (7s)
        if (this.hero.isVisible() && this.remonteTps.isVisible() && this.intersects(this.hero, this.remonteTps)) {
            this.remonte = 0;
            this.audio.getRemonte();
            this.stopTimerRemonteTps();
            this.tpdAffRemonteTps = 0;
            let o = this;
            setTimeout(
                function() {
                    o.remonte = 1;
                }, 7000);
        }
        for (let i = 0; i < this.niveau.length; i++) {
            //  LIMACES COLLISION AVEC CHOUX (SI LIMACES)
            if (this.tabPosLimaces.length > 0) {
                for (let j = 0; j < this.tabPosLimaces.length; j++) {
                    if (this.intersects(this.niveau[this.tabPosLimaces[j]], this.niveau[i])) {
                        // COLLISION CHOU
                        if (this.niveau[i].type() === "chou" || this.niveau[i].type() === "chouBacalan") {
                            this.niveau[i].setVisible(false);
                            this.NbreChoux -= 1;
                            // AUDIO MANGE CHOU
                            this.audio.getMange();
                            if (this.NbreChoux === 0) {
                                this.remonte = 1;
                                this.stopExChou();
                                // AUDIO
                                this.audio.getGagne();
                                this.addScore(this.tps * 60);
                                // FAIRE UNE PAUSE SI GAGNÉ
                                this.pauseMobile = true;
                                /**
                                 * CHANGER FOND + EFFET WAOUH
                                 */
                                this.waouh();
                            }
                        }
                    }
                }
            }
            // COLLISION AVEC LE HERO
            if (this.intersects(this.hero, this.niveau[i])) {
                // COLLISION CHOU
                if (this.niveau[i].type() === "chou") {
                    this.niveau[i].setVisible(false);
                    this.NbreChoux -= 1;
                    this.addScore(200);
                    if (this.NbreChoux === 0) {
                        this.remonte = 1;
                        this.stopExChou();
                        // AUDIO
                        this.audio.getGagne();
                        this.addScore(this.tps * 60);
                        // FAIRE UNE PAUSE SI GAGNÉ
                        this.pauseMobile = true;
                        /**
                         * CHANGER FOND + EFFET WAOUH
                         */
                        this.waouh();
                    }
                } else if (this.niveau[i].type() === "pain") {
                    this.niveau[i].setVisible(false);
                    this.NbreChoux -= 1;
                    this.addScore(300);
                    this.audio.getPain();
                    if (this.NbreChoux === 0) {
                        this.remonte = 1;
                        this.stopExChou();
                        // AUDIO
                        this.audio.getGagne();
                        this.addScore(this.tps * 60);
                        // FAIRE UNE PAUSE SI GAGNÉ
                        this.pauseMobile = true;
                        /**
                         * CHANGER FOND + EFFET WAOUH
                         */
                        this.waouh();
                    }
                } else if (this.niveau[i].type() === "accordeon") {
                    this.niveau[i].setVisible(false);
                    this.NbreChoux -= 1;
                    this.addScore(300);
                    this.audio.getAccordeon();
                    if (this.NbreChoux === 0) {
                        this.remonte = 1;
                        this.stopExChou();
                        // AUDIO
                        this.audio.getGagne();
                        this.addScore(this.tps * 60);
                        // FAIRE UNE PAUSE SI GAGNÉ
                        this.pauseMobile = true;
                        /**
                         * CHANGER FOND + EFFET WAOUH
                         */
                        this.waouh();
                    }
                } else if (this.niveau[i].type() === "chouBacalan") {
                    this.niveau[i].setVisible(false);
                    this.NbreChoux -= 1;
                    this.addScore(350);
                    this.audio.getExChou();
                    this.extraChou();
                    this.extra();
                    if (this.NbreChoux === 0) {
                        this.remonte = 1;
                        this.stopExChou();
                        // AUDIO
                        this.audio.getGagne();
                        this.addScore(this.tps * 60);
                        // FAIRE UNE PAUSE SI GAGNÉ
                        this.pauseMobile = true;
                        /**
                         * CHANGER FOND + EFFET WAOUH
                         */
                        this.waouh();
                    }
                }
                // COLLISION MAIRE SAT LIMACE ET PLUS DE VIES
                else if (this.vies == 0 && this.normal && (this.niveau[i].type() === "maire" || this.niveau[i].type() === "sat" || this.niveau[i].type() === "limace" || this.niveau[i].type() === "trafic")) {
                    // FAIRE UNE PAUSE SI PERDU
                    if (this.tps > 0) {
                        if (this.niveau[i].type() === "trafic") this.audio.getAccident();
                        this.remonte = 1;
                        this.stopExChou();
                        this.perdu();
                        this.hero.setVisible(false);
                        this.pauseMobile = true;
                        this.audio.getPb();
                        this.audio.getPerdu();
                        this.tps = 0;
                        this.lgScore = 2500;
                    }
                } else if (this.tps > 0 && this.vies > 0 && this.normal && (this.niveau[i].type() === "maire" || this.niveau[i].type() === "sat" || this.niveau[i].type() === "limace" || this.niveau[i].type() === "trafic")) {
                    if (this.niveau[i].type() === "trafic") this.audio.getAccident();
                    this.remonte = 1;
                    this.vies--;
                    this.audio.getPerdu();
                    this.extraVie();
                }
            }
        }
    }

    /**
     * AFFICHER LES MESSAGES
     */
    leTexte() {
        this.ctx.font = (this.police).toString() + "px Amatic, cursive";

        // CRÉER LE GRADIENT
        let gradient = this.ctx.createLinearGradient(0, 0, this.plateau.getWidth(), 0);
        // VERT
        gradient.addColorStop("0", "#56FF6D");
        // JAUNE
        gradient.addColorStop("1.0", "#E8D542");
        // MAUVE D090FF
        this.ctx.fillStyle = gradient;
        this.ctx.textAlign = "center";
        this.ctx.shadowColor = 'black';
        this.ctx.shadowOffsetX = -1;
        this.ctx.shadowOffsetY = 1;
    }


    /**
     * AJOUTER AU SCORE + MEMORISER LE SCORE A RETIRER SI RELANCE
     * @param aAjouter Permet d'ajouter une valeur au score
     */
    addScore(aAjouter) {
        let progression = this.progression / 30;
        progression < 1 ? progression = 1 : progression;
        let sc = parseInt(this.score, 10);
        sc = sc + parseInt(aAjouter * progression);
        this.score = sc.toString();
        if (sc > this.lgScore) {
            this.lgScore += 20000;
            this.audio.getOk();
        }
        sc = parseInt(this.scoreTemporaire, 10);
        sc = sc + aAjouter;
        this.scoreTemporaire = sc.toString();
    }

    /**
     * RETIRER AU SCORE
     * @param aRetirer Permet de retirer une valeur au score
     */
    retScore(aRetirer) {
        this.stopExChou();
        let sc = parseInt(this.score, 10);
        sc = sc - aRetirer;
        this.score = sc.toString();
    }

    /**
     * RETIRER 1 SECONDE + FAIRE VITE + SAVOIR SI C'EST DEMMARÉ
     */
    tempo() {
        let sc = parseInt(this.tps, 10);
        if (this.remonte == 0) {
            sc += 1;
        } else sc -= 1;
        this.tps = sc.toString();
        // FAIRE VITE !
        if (!this.vite && this.tps < 6) {
            this.vite = true;
            this.audio.getStartVite();
        } else if (this.tps == 0) {
            this.audio.getPerdu();
            this.timeup();
        }
        // DEMARRAGE ?
        if (this.enAttente) this.enAttente = false;
        // COMPTER TPS DE JEU POUR LE ONEUP
        if (this.tps <= 0 || this.enAttente) {} else {
            this.tpdAffOneUp++;
            this.tpdAffRemonteTps++;
        }
    }

    /**
     * VIDER LE CONTENU DU CANVA
     */
    clear() {
        this.ctx.clearRect(0, 0, this.plateau.getWidth(), this.plateau.getHeight());
    }

    /**
     * ÉCOUTEUR CLAVIER/SOURIS/MANETTE DU HERO
     * @param o L'objet écouté
     */
    clavier(o) {
        const can = o.plateau.getCanvas();
        // MANETTE
        var haveEvents = 'ongamepadconnected' in window;
        var controllers = {};

        function connecthandler(e) {
            addgamepad(e.gamepad);
        }

        function addgamepad(gamepad) {
            controllers[gamepad.index] = gamepad;
            requestAnimationFrame(updateStatus);
        }

        function disconnecthandler(e) {
            removegamepad(e.gamepad);
        }

        function removegamepad(gamepad) {
            delete controllers[gamepad.index];
        }

        function updateStatus() {
            if (!haveEvents) {
                scangamepads();
            }
            let i = 0;
            let j;

            for (j in controllers) {
                let controller = controllers[j];
                // LISTER LES BOUTONS ET ÉTATS
                // for (i = 0; i < controller.buttons.length; i++) {
                //     console.log(i + ' _Valeur ' + controller.buttons[i].val + ' _Pressé ' + controller.buttons[i].pressed)
                // }

                // BOUTON POUR DÉMARRER
                if (controller.buttons[0].pressed) {
                    // REGLES DU JEU & POUR CHROME CHARGEMENT DE LA MUSIQUE
                    if (o.copy == 1 && o.timer === undefined) {
                        // CPTE A REBOURD 1S
                        o.timer = setInterval(function() {
                            o.tempo();
                        }, 1000);
                        //o.audio.getMusique();
                    }
                    // CLIQUER POUR RELANCER PENDANT 5 SEC.
                    if (o.copy == 1 && (o.tps > o.car - 5 || o.tps <= 0)) {
                        // RETIRE LE SCORE COURANT SI LA PARTIE EST COMMENCEE
                        if (o.tps > o.car - 5) {
                            o.retScore(o.scoreTemporaire);
                        }
                        // SI GAGNÉ => NOUVEAU NIVEAU
                        if (o.gagne) {
                            o.nouveauNiveau();
                        }
                        o.hero.setVisible(true);
                        o.NbreChoux = o.QteChoux;
                        o.tps = o.car;
                        o.vite = false;
                        o.raz();
                        o.recharger();
                        o.extraDebut();
                    }
                }

                // H [1]=-1 B[1]=1 G[0]=1 D[0]=1 
                // RÉCUPÉRER LA CORRESPONDANCE CLAVIER
                let app = 0;
                let relache = 0;
                if (o.tps >= 0 && o.copy == 1) {

                    if (controller.axes[0] == -1) {
                        o.hero.gauche(true);
                        app = 37;
                        relache = 1;
                    }
                    if (controller.axes[0] == 1) {
                        o.hero.droite(true);
                        app = 39;
                        relache = 1;
                    }
                    if (controller.axes[1] == -1) {
                        o.hero.haut(true);
                        app = 38;
                        relache = 1;
                    }
                    if (controller.axes[1] == 1) {
                        o.hero.bas(true);
                        app = 40;
                        relache = 1;
                    }
                    if (relache == 1) o.clavierSouris = 2;
                }
                // AJOUTER DE LA VÉLOCITÉ
                if (o.touche == app) {
                    o.hero.veloPlusMan();
                } else {
                    o.touche = app;
                    o.hero.veloRAZ();
                }
                // REGLES DU JEU & POUR CHROME CHARGEMENT DE LA MUSIQUE
                if (o.timer === undefined && o.copy == 1) {
                    o.extraDebut();
                    // CPTE A REBOURD 1S
                    o.timer = setInterval(function() {
                        o.tempo();
                    }, 1000);
                    //o.audio.getMusique();
                }
                // RELACHE
                if (o.clavierSouris == 2 && relache == 0) {
                    o.hero.gauche(false);
                    o.hero.droite(false);
                    o.hero.haut(false);
                    o.hero.bas(false);
                    o.clavierSouris = 0;
                }
            }
            requestAnimationFrame(updateStatus);
        }

        function scangamepads() {
            let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
            for (let i = 0; i < gamepads.length; i++) {
                if (gamepads[i]) {
                    if (gamepads[i].index in controllers) {
                        controllers[gamepads[i].index] = gamepads[i];
                    } else {
                        addgamepad(gamepads[i]);
                    }
                }
            }
        }
        window.addEventListener("gamepadconnected", connecthandler);
        window.addEventListener("gamepaddisconnected", disconnecthandler);
        if (!haveEvents) {
            setInterval(scangamepads, 500);
        }
        // FIN MANETTE      

        // ÉCOUTEURS MOBILE BOUGE
        can.addEventListener('touchmove', function(e) {
            e.preventDefault();
            if ((o.tps == o.car || o.tps <= 0) && !o.pauseMobile && o.copy == 1) {
                // SI GAGNÉ => NOUVEAU NIVEAU
                if (o.gagne) {
                    o.nouveauNiveau();
                }
                o.hero.setVisible(true);
                o.NbreChoux = o.QteChoux;
                o.tps = o.car;
                o.vite = false;
                o.raz();
                o.recharger();
                o.extraDebut();
            } else {
                // SAVOIR l'ORIENTATION DU MOBILE
                let orientation = screen.msOrientation || (screen.orientation || screen.mozOrientation || {}).type; // ITÉRER À TRAVERS LES POINTS DE CONTACT QUI ONT BOUGÉ.
                for (let i = 0; i < e.changedTouches.length; i++) {

                    if (orientation === "portrait-secondary" || orientation === "portrait-primary" || orientation === undefined) {
                        // RÉCUPÉRER LA POSITION
                        o.hero.setPositionX(e.changedTouches[i].pageX - o.hero.getW() / 2);
                        o.hero.setPositionY(e.changedTouches[i].pageY - o.hero.getH() / 2);
                    } else {
                        // RÉCUPÉRER LA POSITION
                        o.hero.setPositionX(e.changedTouches[i].pageX - o.hero.getW() * 3);
                        o.hero.setPositionY(e.changedTouches[i].pageY - o.hero.getH());
                    }
                }
            }
            e.stopPropagation();

        }, { passive: false });
        // ÉCOUTEURS MOBILE NE BOUGE PLUS
        can.addEventListener('touchend', function(e) {
            e.preventDefault();
            // GÉRER LES PAUSES QUAND C'EST PERDU OU GAGNÉ
            if (o.pauseMobile) o.pauseMobile = false;
            e.stopPropagation();
        }, { passive: false });

        // ÉCOUTEURS MOBILE COMMENCE À BOUGER
        can.addEventListener('touchstart', function(e) {
            e.preventDefault();
            // REGLES DU JEU & POUR CHROME CHARGEMENT DE LA MUSIQUE
            if (o.timer === undefined && o.copy == 1) {
                o.extraDebut();
                // CPTE A REBOURD 1S
                o.timer = setInterval(function() {
                    o.tempo();
                }, 1000);
                //o.audio.getMusique();
            }
            e.stopPropagation();
        }, { passive: false });


        // ÉCOUTEURS CLAVIER
        document.addEventListener("keydown", function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            o.clavierSouris = 0;
            // AJOUTER DE LA VÉLOCITÉ
            if (o.touche == evt.keyCode) {
                o.hero.veloPlus();
            } else {
                o.touche = evt.keyCode;
                o.hero.veloRAZ();
            }
            // REGLES DU JEU & POUR CHROME CHARGEMENT DE LA MUSIQUE
            if (o.timer === undefined && o.copy == 1) {
                o.extraDebut();
                // CPTE A REBOURD 1S
                o.timer = setInterval(function() {
                    o.tempo();
                }, 1000);
                //o.audio.getMusique();
            }
            if (o.tps >= 0 && o.copy == 1) {
                if (evt.keyCode === 37) {
                    o.hero.gauche(true);
                }
                if (evt.keyCode === 39) {
                    o.hero.droite(true);
                }
                if (evt.keyCode === 38) {
                    o.hero.haut(true);
                }
                if (evt.keyCode === 40) {
                    o.hero.bas(true);
                }
            }
            // APPUYER SUR ESPACE POUR RELANCER PENDANT 5 SEC.
            if (evt.keyCode === 32 && o.copy == 1 && (o.tps > o.car - 5 || o.tps <= 0)) {
                // RETIRE LE SCORE COURANT SI LA PARTIE EST COMMENCEE
                if (o.tps > o.car - 5) {
                    o.retScore(o.scoreTemporaire);
                }
                // SI GAGNÉ => NOUVEAU NIVEAU
                if (o.gagne) {
                    o.nouveauNiveau();
                }
                o.hero.setVisible(true);
                o.NbreChoux = o.QteChoux;
                o.tps = o.car;
                o.vite = false;
                o.raz();
                o.recharger();
                o.extraDebut();
            }
        });
        document.addEventListener("keyup", function(evt) {
            o.ctx.canvas.style.cursor = "auto";
            // AJOUTER DE LA VÉLOCITÉ ?
            if (o.touche === evt.keyCode) {
                o.hero.veloPlus();
            } else {
                o.touche = evt.keyCode;
                o.hero.veloRAZ();
            }
            if (evt.keyCode === 37) o.hero.gauche(false);
            if (evt.keyCode === 39) o.hero.droite(false);
            if (evt.keyCode === 38) o.hero.haut(false);
            if (evt.keyCode === 40) o.hero.bas(false);
            if (evt.keyCode === 27) {
                window.api.send('envoi-reduire');
            }
            if (o.meilleur && o.copy == 1 && o.tps == 0) {
                if (evt.keyCode == 8) {
                    o.nomMeilleur = o.nomMeilleur.slice(0, -1);
                } else if (evt.keyCode == 46) {
                    o.nomMeilleur = '';
                } else {
                    if (evt.keyCode == 32) {} else {
                        if (evt.key.length == 1 && evt.key.match(/^[\w\s]+$/) && o.nomMeilleur.length < 11) {
                            o.nomMeilleur += evt.key;
                        }
                    }
                }
                o.setMeilleur();
            }
        })

        // Souris bouge
        o.ctx.canvas.addEventListener("mousemove", e => {
            e.preventDefault();
            e.stopPropagation();
            if (o.curseur == 1) {
                o.clavierSouris = 1;
                o.hero.setPositionX(Math.round(e.clientX - o.cRectL));
                o.hero.setPositionY(Math.round(e.clientY - o.cRectT));
            }
        });

        o.ctx.canvas.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            // REGLES DU JEU & POUR CHROME CHARGEMENT DE LA MUSIQUE
            if (o.copy == 1 && o.timer === undefined) {
                // CPTE A REBOURD 1S
                o.timer = setInterval(function() {
                    o.tempo();
                }, 1000);
                //o.audio.getMusique();
            }
            // CLIQUER POUR RELANCER PENDANT 5 SEC.
            if (o.copy == 1 && (o.tps > o.car - 5 || o.tps <= 0)) {
                // RETIRE LE SCORE COURANT SI LA PARTIE EST COMMENCEE
                if (o.tps > o.car - 5) {
                    o.retScore(o.scoreTemporaire);
                }
                // SI GAGNÉ => NOUVEAU NIVEAU
                if (o.gagne) {
                    o.nouveauNiveau();
                }
                o.hero.setVisible(true);
                o.NbreChoux = o.QteChoux;
                o.tps = o.car;
                o.vite = false;
                o.raz();
                o.recharger();
                o.extraDebut();
            }
        });
    }

    /**
     * Gérer le curseur de la souris
     */
    sansCurseur() {
        //this.ctx.canvas.style.cursor = 'none';
        if (this.curseur == 1) {} else {
            this.ctx.canvas.style.cursor = "none";
            this.ctx.canvas.dispatchEvent(new Event('mousemove'));
            if (this.curseur == 0) this.curseur = 1;
        }
    }
    avecCurseur() {
        //this.ctx.canvas.style.cursor = 'auto';     
        if (this.curseur == 0) {} else {
            this.ctx.canvas.style.cursor = "auto";
            if (this.curseur == 1) this.curseur = 0;
        }
    }

    /**
     * ALGORITHME DES COLLISIONS ENTRE DEUX OBJETS VISIBLES
     * @param a Objet a
     * @param b Objet b
     */
    intersects(a, b) {
        if (a.isVisible() && b.isVisible()) {
            let x1 = Math.max(a.left(), b.left());
            let x2 = Math.min(a.right(), b.right());
            let y1 = Math.max(a.top(), b.top());
            let y2 = Math.min(a.bottom(), b.bottom());
            return (x1 < x2 && y1 < y2);
        } else return false;
    }

    /**
     * RAZ DU JEU + SCORE TEMPORAIRE SI OK + STOCKAGE DU MEILLEUR SCORE
     */
    raz() {
        this.hero.init();
        for (let i = 0; i < this.niveau.length; i++) {
            this.niveau[i].setVisible(true);
        }
        if (this.gagne) {
            this.scoreTemporaire = 0;
        } else {
            this.score = "0";
            this.scoreAffiche = 0;
            this.premierNiveau();
        }
        this.audio.getStopVite();
    }

    /**
     * LANCER L'EFFET CSS INTRO
     */
    intro() {
        this.plateau.getCanvas().classList.remove("intro");
        this.plateau.getCanvas().offsetWidth;
        this.plateau.getCanvas().classList.add("intro");
    }

    /**
     * LANCER L'EFFET CSS WAOUH
     */
    waouh() {
        this.plateau.getCanvas().classList.remove("rebond");
        this.plateau.getCanvas().classList.remove("intro");
        this.plateau.getCanvas().classList.remove("wow");
        this.plateau.getCanvas().classList.remove("perdu");
        this.plateau.getCanvas().classList.remove("extra");
        this.plateau.getCanvas().offsetWidth;
        this.plateau.getCanvas().classList.add("wow");
        clearInterval(this.fps);
        let i = this.plateau.getIFond();
        let j = i;
        while (j === i) {
            j = this.getRandomInt(this.ttImages);
        }
        this.plateau.setFond(j);
        this.boucle(this);
    }

    /**
     * LANCER L'EFFET CSS PERDU
     */
    perdu() {
        this.plateau.getCanvas().classList.remove("extra");
        this.plateau.getCanvas().classList.remove("rebond");
        this.plateau.getCanvas().classList.remove("intro");
        this.plateau.getCanvas().classList.remove("perdu");
        this.plateau.getCanvas().offsetWidth;
        this.plateau.getCanvas().classList.add("perdu");
    }

    /**
     * LANCER L'EFFET CSS TEMPS ÉCOULÉ
     */
    timeup() {
        this.plateau.getCanvas().classList.remove("extra");
        this.plateau.getCanvas().classList.remove("rebond");
        this.plateau.getCanvas().classList.remove("intro");
        this.plateau.getCanvas().classList.remove("perdu");
        this.plateau.getCanvas().offsetWidth;
        this.plateau.getCanvas().classList.add("rebond");
    }

    /**
     * LANCER L'EFFET CSS EXTRA CHOU
     */
    extra() {
        this.plateau.getCanvas().classList.remove("extra");
        this.plateau.getCanvas().classList.remove("rebond");
        this.plateau.getCanvas().classList.remove("intro");
        this.plateau.getCanvas().classList.remove("perdu");
        this.plateau.getCanvas().offsetWidth;
        this.plateau.getCanvas().classList.add("extra");
    }


    /***
     * Rendre invincible 2.345 secondes
     */
    extraChou() {
        this.stopExChou();
        this.normal = false;
        let o = this;
        this.clignote = setInterval(
            function() {
                o.hero.getIndiceImage() === 0 ? o.hero.setIndiceImage(1) : o.hero.setIndiceImage(0);
            }, 100);
        this.exChou = setTimeout(
            function() {
                o.normal = true;
                clearInterval(o.clignote);
                o.hero.setIndiceImage(0);
            }, 2345);
    }

    /***
     * Rendre invincible 1,5 seconde au début
     */
    extraDebut() {
        this.stopExChou();
        this.normal = false;
        let o = this;
        this.clignoteDebut = setInterval(
            function() {
                o.hero.getIndiceImage() === 0 ? o.hero.setIndiceImage(2) : o.hero.setIndiceImage(0);
            }, 100);
        this.exChouDebut = setTimeout(
            function() {
                o.normal = true;
                clearInterval(o.clignoteDebut);
                o.hero.setIndiceImage(0);
            }, 1500);
    }

    /***
     * Rendre invincible 1 seconde quand perd une vie
     */
    extraVie() {
        this.stopExChou();
        this.normal = false;
        let o = this;
        this.clignoteVie = setInterval(
            function() {
                o.hero.getIndiceImage() === 0 ? o.hero.setIndiceImage(3) : o.hero.setIndiceImage(0);
            }, 100);
        this.exChouVie = setTimeout(
            function() {
                o.normal = true;
                clearInterval(o.clignoteVie);
                o.hero.setIndiceImage(0);
            }, 1000);
    }

    /**
     * STOP L'EXTRA CHOU
     */
    stopExChou() {
        // STOP VIE-- CHOU        
        clearInterval(this.clignoteVie);
        clearTimeout(this.exChouVie);
        // STOP EXTRA DÉBUT    
        clearInterval(this.clignoteDebut);
        clearTimeout(this.exChouDebut);
        // STOP EXTRA CHOU DÉBUT
        clearInterval(this.clignote);
        clearTimeout(this.exChou);

        this.normal = true;
        this.hero.setIndiceImage(0);
    }

    /**
     * STOP TIMER ONEUP
     */
    stopTimerOneUp() {
        clearTimeout(this.timerOneUp);
        this.oneUp.setVisible(false);
        // POSITIONNER LE ONEUP
        let x = (this.getRandomInt(this.w - this.oneUp.getW()));
        let y = (this.getRandomInt(this.h - this.oneUp.getH()));
        this.oneUp.setPositionX(x);
        this.oneUp.setPositionY(y);
        this.timerOneUp = null;
    }

    /**
     * STOP TIMER REMONTE TPS
     */
    stopTimerRemonteTps() {
        clearTimeout(this.timerRemonteTps);
        this.remonteTps.setVisible(false);
        // POSITIONNER REMONTE TPS
        let x = (this.getRandomInt(this.w - this.remonteTps.getW()));
        let y = (this.getRandomInt(this.h - this.remonteTps.getH()));
        this.remonteTps.setPositionX(x);
        this.remonteTps.setPositionY(y);
        this.timerRemonteTps = null;
    }

    /**
     * ALGORITHME QUI RETOURNE UN ENTIER ALEATOIRE ENTRE 0 ET MAX-1
     * @param max Valeur maximale non comprise
     */
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    /**
     * ALGORITHME QUI RETOURNE UN ENTIER ALEATOIRE ENTRE MIN ET MAX-1
     * @param max Valeur maximale non comprise
     */
    getRandomIntPlus(min, max) {
        return Math.floor(Math.random() * Math.floor(max)) + min;
    }

    /**
     * ALGORITHME QUI RETOURNE UN ENTIER ALEATOIRE ENTRE 1 ET MAX
     * @param max Valeur maximale non comprise
     */
    getRandomIntDeplace(max) {
        return Math.floor(Math.random() * Math.floor(max)) + 1;
    }

    /***
     * SAUVEGARDER LE SCORE MAX EN PRENANT EN COMPTE LE RETOUR
     */
    setStorage() {
        try {
            if (typeof localStorage === 'undefined') {
                return this.trad.soupesNonEnr[this.langue];
            } else {
                if (this.score === "0") {} else {
                    if (this.getStorage() === this.trad.pasDesoupesEnr[this.langue]) {
                        window.localStorage.setItem("choux", parseInt(this.score, 10));
                    } else if (parseInt(localStorage.getItem("choux"), 10) < parseInt(this.score, 10)) {
                        window.localStorage.setItem("choux", this.score);
                    }
                }
            }
        } catch (e) {
            return this.trad.soupesNonEnr[this.langue];
        }
    }


    /***
     * RÉCUPÉRER LE SCORE MAX
     */
    getStorage() {
        try {
            if (typeof localStorage === 'undefined') {
                return this.trad.soupesNonEnr[this.langue];
            } else {
                let retour = window.localStorage.getItem("choux");
                if (retour === null) return this.trad.pasDesoupesEnr[this.langue];
                else if (retour === this.score || parseInt(retour, 10) === parseInt(this.score, 10) - this.scoreTemporaire) {
                    return this.trad.votreRecordEst[this.langue] + retour + this.trad.HtmlScoreSoupes[this.langue];
                } else return this.trad.leRecordEst[this.langue] + retour + this.trad.HtmlScoreSoupes[this.langue];
            }
        } catch (e) {
            return this.trad.soupesNonEnr[this.langue];
        }
    }

    /***
     * RÉCUPÉRER LE MEILLEUR JOUEUR
     */
    getMeilleur() {
        try {
            if (typeof localStorage === 'undefined') {} else {
                window.localStorage.getItem("meilleur") === null ? this.nomMeilleur = '' : this.nomMeilleur = window.localStorage.getItem("meilleur");
            }
        } catch (e) {}
    }

    /***
     * DÉFINIR LE MEILLEUR JOUEUR
     */
    setMeilleur() {
        try {
            if (typeof localStorage === 'undefined') {} else {
                if (this.score === "0") {} else {
                    if (this.getStorage() === "Pas de soupes enregistrées") {} else {
                        window.localStorage.setItem("meilleur", this.nomMeilleur);
                    }
                }
            }
        } catch (e) {
            return this.trad.soupesNonEnr[this.langue];
        }
    }

    /***
     * RÉCUPÉRER LE MEILLEUR JOUEUR ET SON SCORE
     */
    getNomScoreMeilleur() {
        let retour = '';
        try {
            if (typeof localStorage === 'undefined') {} else {
                (window.localStorage.getItem("meilleur") === '' || window.localStorage.getItem("meilleur") === null) ? retour = this.trad.HtmlScoreAnonTxt[this.langue]: retour = window.localStorage.getItem("meilleur").toUpperCase();
                window.localStorage.getItem("choux") === null ? retour = '' : retour += this.trad.HtmlScoreAvec[this.langue] + window.localStorage.getItem("choux") + this.trad.HtmlScoreSoupes[this.langue];
            }
        } catch (e) {} finally {
            return retour;
        }
    }

    /***
     * RÉCUPÉRER LA LANGUE UTILISÉE
     */
    getLangue() {
        let retour = '';
        try {
            if (typeof localStorage === 'undefined') {} else {
                (window.localStorage.getItem("langue") === '' || window.localStorage.getItem("langue") === null) ? retour = this.trad.defaut: retour = window.localStorage.getItem("langue");
            }
        } catch (e) {} finally {
            return retour;
        }
    }

    /***
     * DÉFINIR LA LANGUE
     */
    setLangue(txt) {
        let retour = -1;
        try {
            window.localStorage.setItem("langue", txt);
            retour = 0;
        } catch (e) {
            retour = -1;
        } finally {
            this.tradHTML();
            return retour;
        }
    }

    /**
     * TRADUIRE LE HTML
     */
    tradHTML() {
        document.getElementById('fermer').setAttribute('title', this.trad.HtmlQuitter[this.langue]);
        document.getElementById('win').setAttribute('title', this.trad.HtmlReduire[this.langue]);
        document.getElementById('musOff').setAttribute('title', this.trad.HtmlMusiqueOff[this.langue]);
        document.getElementById('musOn').setAttribute('title', this.trad.HtmlMusiqueOn[this.langue]);
        document.getElementById('volOn').setAttribute('title', this.trad.HtmlAudioOn[this.langue]);
        document.getElementById('volOff').setAttribute('title', this.trad.HtmlAudioOff[this.langue]);
        document.getElementById('maj').setAttribute('title', this.trad.HtmlMaj[this.langue]);
        document.getElementById('trad').setAttribute('title', this.trad.HtmlTrad[this.langue]);
        document.getElementById('copy').setAttribute('title', this.trad.HtmlCopyTxt[this.langue]);
    }

}