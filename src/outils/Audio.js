"use strict";


class Audio {

    constructor() {
        this.fadein;
        this.fadeinMus;
    }

    /**
     * DÉFINIR LA MUSIQUE
     * @param {Le chemin relatif vers la musique} srcMusique
     */
    setMusique(srcMusique) {
        this.srcMusique = srcMusique;
        if (document.getElementById('musique') == undefined) {
            this.musique = document.createElement('audio');
            this.musique.setAttribute('id', "musique");
            this.creerSrc(srcMusique, this.musique);

            // this.musique.setAttribute('autoplay', "true");
            this.musique.setAttribute('loop', "true");
            document.body.appendChild(this.musique);

            // INIT AUDIO (PAR DÉFAUT MUSIQUE OFF ET SON ON)
            let obj = this.getAudioMem();
            if (obj.musique == 0) {
                this.remettreLaMusique();
                let winEl2 = document.getElementById('musOn');
                winEl2.classList.remove("woow");
                winEl2.offsetWidth;
                winEl2.classList.add("woow");
            }
            if (obj.audio == 1) {
                this.couperLeSon();
                let winEl2 = document.getElementById('volOn');
                winEl2.classList.remove("woow");
                winEl2.offsetWidth;
                winEl2.classList.add("woow");
            }

            let o = this;
            // ÉCOUTEURS AUDIO
            document.getElementById('musOff').addEventListener("click", function(evt) {
                testMus(o);
            })
            document.getElementById('musOn').addEventListener("click", function(evt) {
                testMus(o);
            })

            function testMus(o) {
                if (document.getElementById('musOff').style.display === "none") {
                    o.couperLaMusique();
                } else {
                    o.remettreLaMusique();
                }
                let winEl = document.getElementById('musOff');
                let winEl2 = document.getElementById('musOn');
                winEl.classList.remove("woow");
                winEl2.classList.remove("woow");
                winEl.offsetWidth;
                winEl2.offsetWidth;
                winEl.classList.add("woow");
                winEl2.classList.add("woow");
            }

            document.getElementById('volOff').addEventListener("click", function(evt) {
                testVol(o);
            })
            document.getElementById('volOn').addEventListener("click", function(evt) {
                testVol(o);
            })

            function testVol(o) {
                if (document.getElementById('volOff').style.display === "none") {
                    o.remettreLeSon();
                } else {
                    o.couperLeSon();
                }
                let winEl = document.getElementById('volOff');
                let winEl2 = document.getElementById('volOn');
                winEl.classList.remove("woow");
                winEl2.classList.remove("woow");
                winEl.offsetWidth;
                winEl2.offsetWidth;
                winEl.classList.add("woow");
                winEl2.classList.add("woow");
            }
        }
    }

    /**
     * PARAMÈTRES AUDIO (INIT, ÉCOUTEURS, ET SAUVEGARDES)
     */
    couperLaMusique() {
        document.getElementById('musOn').style.display = "none";
        document.getElementById('musOff').style.display = "block";
        document.getElementById('musique').pause();
        this.setAudioMem(-1, 1);
    }
    remettreLaMusique() {
        document.getElementById('musOff').style.display = "none";
        document.getElementById('musOn').style.display = "block";
        document.getElementById('musique').play();
        this.setAudioMem(-1, 0);
    }
    remettreLeSon() {
        document.getElementById('volOn').style.display = "none";
        document.getElementById('volOff').style.display = "block";
        window.api.send('envoi-volOn');
        this.setAudioMem(0, -1);
    }
    couperLeSon() {
        document.getElementById('volOff').style.display = "none";
        document.getElementById('volOn').style.display = "block";
        window.api.send('envoi-volOff');
        this.setAudioMem(1, -1);
    }

    /**
     * DÉFINIR LE SON DU BONUS
     * @param {Le chemin relatif vers le son ok} srcOk
     */
    setOk(srcOk) {
        if (document.getElementById('sonOk') == undefined) {
            this.srcOk = srcOk;
            this.sonOk = document.createElement('audio');
            this.sonOk.setAttribute('id', "sonOk");

            this.creerSrc(srcOk, this.sonOk);

            document.body.appendChild(this.sonOk);
        }
    }

    /**
     * DÉFINIR LE SON D'UN PROBLÈME
     * @param {Le chemin relatif vers le son pb} srcPb
     */
    setPb(srcPb) {
        if (document.getElementById('sonPb') == undefined) {
            this.srcPb = srcPb;
            this.sonPb = document.createElement('audio');
            this.sonPb.setAttribute('id', "sonPb");

            this.creerSrc(srcPb, this.sonPb);

            document.body.appendChild(this.sonPb);
        } else {
            this.sonOk.setAttribute('src', this.srcPb);
        }
    }

    /**
     * DÉFINIR LE SON FAIRE VITE
     * @param {Le chemin relatif vers le son faire vite} srcVite
     */
    setVite(srcVite) {
        if (document.getElementById('sonVite') == undefined) {
            this.srcVite = srcVite;
            this.sonVite = document.createElement('audio');
            this.sonVite.setAttribute('id', "sonVite");
            this.sonVite.setAttribute('loop', "true");

            this.creerSrc(srcVite, this.sonVite);

            document.body.appendChild(this.sonVite);
        } else {
            this.sonOk.setAttribute('src', this.srcVite);
        }
    }

    /**
     * DÉFINIR LE SON PERDU
     * @param {Le chemin relatif vers le son perdu} srcVie
     */
    setVie(srcVie) {
        if (document.getElementById('sonVie') == undefined) {
            this.srcVie = srcVie;
            this.sonVie = document.createElement('audio');
            this.sonVie.setAttribute('id', "sonVie");

            this.creerSrc(srcVie, this.sonVie);

            document.body.appendChild(this.sonVie);
        } else {
            this.sonOk.setAttribute('src', this.srcVie);
        }
    }

    /**
     * DÉFINIR LE SON PERDU
     * @param {Le chemin relatif vers le son perdu} srcPerdu
     */
    setPerdu(srcPerdu) {
        if (document.getElementById('sonPerdu') == undefined) {
            this.srcPerdu = srcPerdu;
            this.sonPerdu = document.createElement('audio');
            this.sonPerdu.setAttribute('id', "sonPerdu");

            this.creerSrc(srcPerdu, this.sonPerdu);

            document.body.appendChild(this.sonPerdu);
        } else {
            this.sonOk.setAttribute('src', this.srcPerdu);
        }
    }

    /**
     * DÉFINIR LE SON GAGNE
     * @param {Le chemin relatif vers le son gagne} srcGagne
     */
    setGagne(srcGagne) {
        if (document.getElementById('sonGagne') == undefined) {
            this.srcGagne = srcGagne;
            this.sonGagne = document.createElement('audio');
            this.sonGagne.setAttribute('id', "sonGagne");

            this.creerSrc(srcGagne, this.sonGagne);

            document.body.appendChild(this.sonGagne);
        } else {
            this.sonOk.setAttribute('src', this.srcGagne);
        }
    }

    /**
     * DÉFINIR LE SON SCORE
     * @param {Le chemin relatif vers le son score} srcScore
     */
    setScore(srcScore) {
        if (document.getElementById('sonScore') == undefined) {
            this.srcScore = srcScore;
            this.sonScore = document.createElement('audio');
            this.sonScore.setAttribute('id', "sonScore");

            this.creerSrc(srcScore, this.sonScore);

            document.body.appendChild(this.sonScore);
        } else {
            this.sonOk.setAttribute('src', this.srcScore);
        }
    }

    /**
     * DÉFINIR LE SON EXTRA-CHOU
     * @param {Le chemin relatif vers le son extreChou} srcExChou
     */
    setExChou(srcExChou) {
        if (document.getElementById('sonExChou') == undefined) {
            this.srcExChou = srcExChou;
            this.sonExChou = document.createElement('audio');
            this.sonExChou.setAttribute('id', "sonExChou");

            this.creerSrc(srcExChou, this.sonExChou);

            document.body.appendChild(this.sonExChou);
        } else {
            this.sonOk.setAttribute('src', this.srcExChou);
        }
    }

    /**
     * DÉFINIR LE SON MANGE
     * @param {Le chemin relatif vers le son mange} srcMange
     */
    setMange(srcMange) {
        if (document.getElementById('sonMange') == undefined) {
            this.srcMange = srcMange;
            this.sonMange = document.createElement('audio');
            this.sonMange.setAttribute('id', "sonMange");

            this.creerSrc(srcMange, this.sonMange);

            document.body.appendChild(this.sonMange);
        } else {
            this.sonOk.setAttribute('src', this.srcMange);
        }
    }

    /**
     * DÉFINIR LE SON ACCORDÉON
     * @param {Le chemin relatif vers le son accordéon} srcAccordeon
     */
    setAccordeon(srcAccordeon) {
        if (document.getElementById('sonAccordeon') == undefined) {
            this.srcAccordeon = srcAccordeon;
            this.sonAccordeon = document.createElement('audio');
            this.sonAccordeon.setAttribute('id', "sonAccordeon");

            this.creerSrc(srcAccordeon, this.sonAccordeon);

            document.body.appendChild(this.sonAccordeon);
        } else {
            this.sonOk.setAttribute('src', this.srcAccordeon);
        }
    }

    /**
     * DÉFINIR LE SON PAIN
     * @param {Le chemin relatif vers le son pain} srcPain
     */
    setPain(srcPain) {
        if (document.getElementById('sonPain') == undefined) {
            this.srcPain = srcPain;
            this.sonPain = document.createElement('audio');
            this.sonPain.setAttribute('id', "sonPain");

            this.creerSrc(srcPain, this.sonPain);

            document.body.appendChild(this.sonPain);
        } else {
            this.sonOk.setAttribute('src', this.srcPain);
        }
    }

    /**
     * DÉFINIR LE SON KLAXON
     * @param {Le chemin relatif vers le son klaxon} srcKlaxon
     */
    setKlaxon(srcKlaxon) {
        if (document.getElementById('sonKlaxon') == undefined) {
            this.srcKlaxon = srcKlaxon;
            this.sonKlaxon = document.createElement('audio');
            this.sonKlaxon.setAttribute('id', "sonKlaxon");

            this.creerSrc(srcKlaxon, this.sonKlaxon);

            document.body.appendChild(this.sonKlaxon);
        } else {
            this.sonOk.setAttribute('src', this.srcKlaxon);
        }
    }

    /**
     * DÉFINIR LE SON ACCIDENT
     * @param {Le chemin relatif vers le son Accident} srcAccident
     */
    setAccident(srcAccident) {
        if (document.getElementById('sonAccident') == undefined) {
            this.srcAccident = srcAccident;
            this.sonAccident = document.createElement('audio');
            this.sonAccident.setAttribute('id', "sonAccident");

            this.creerSrc(srcAccident, this.sonAccident);

            document.body.appendChild(this.sonAccident);
        } else {
            this.sonOk.setAttribute('src', this.srcAccident);
        }
    }

    /**
     * DÉFINIR REMONTE LE TPS
     * @param {Le chemin relatif vers le son Remonte} srcRemonte
     */
    setRemonte(srcRemonte) {
        if (document.getElementById('sonRemonte') == undefined) {
            this.srcRemonte = srcRemonte;
            this.sonRemonte = document.createElement('audio');
            this.sonRemonte.setAttribute('id', "sonRemonte");

            this.creerSrc(srcRemonte, this.sonRemonte);

            document.body.appendChild(this.sonRemonte);
        } else {
            this.sonOk.setAttribute('src', this.srcRemonte);
        }
    }

    /**
     * LIRE LA MUSIQUE
     */
    getMusique() {
        this.musique.play();
    }

    /**
     * LIRE LE SON DU BONUS
     */
    getOk() {
        this.sonOk.play();
    }

    /**
     * LIRE LE SON DU PROBLÈME
     */
    getPb() {
        this.sonPb.play();
    }

    /**
     * LIRE LE SON FAIRE VITE
     */
    getStartVite() {
        clearInterval(this.fadeinMus);
        clearInterval(this.fadein);
        this.musique.volume = 0.15;
        this.sonVitePlay = this.sonVite.play();
    }

    /**
     * STOPPER LE SON FAIRE VITE
     */
    getStopVite() {
        if (this.sonVitePlay !== undefined) {
            this.sonVitePlay.then(_ => {
                    this.sonVite.pause();
                })
                .catch(error => {});
        }
    }

    /**
     * LIRE LE SON VIE
     */
    getVie() {
        this.sonVie.play();
    }

    /**
     * LIRE LE SON MANGE
     */
    getMange() {
        this.sonMange.play();
    }

    /**
     * LIRE LE SON ACCORDÉON
     */
    getAccordeon() {
        clearInterval(this.fadeinMus);
        clearInterval(this.fadein);
        this.musique.volume = 0.1;
        this.sonVite.volume = 0.5;
        this.sonExChou.currentTime = 0;
        this.sonGagne.currentTime = 0;
        this.sonAccordeon.play();
        let o = this;
        this.sonExChou.onended = function() {
            o.fadeInRapMusique();
        };
    }

    /**
     * LIRE LE SON PAIN
     */
    getPain() {
        this.sonPain.play();
    }

    /**
     * LIRE LE SON KLAXON
     */
    getKlaxon() {
        this.sonKlaxon.play();
    }

    /**
     * LIRE LE SON ACCIDENT
     */
    getAccident() {
        this.sonAccident.play();
    }

    /**
     * LIRE LE SON REMONTE LE TPS
     */
    getRemonte() {
        this.sonRemonte.play();
    }

    /**
     * LIRE LE SON PERDU
     */
    getPerdu() {
        clearInterval(this.fadeinMus);
        clearInterval(this.fadein);
        this.musique.volume = 0.2;
        this.sonPerdu.play();
        let o = this;
        this.sonPerdu.onended = function() {
            o.fadeInMusique();
        };
    }

    /**
     * LIRE LE SON GAGNE
     */
    getGagne() {
        clearInterval(this.fadeinMus);
        clearInterval(this.fadein);
        this.musique.volume = 0;
        if (this.sonExChouPlay !== undefined) {
            this.sonExChouPlay.then(_ => {
                    this.sonExChou.pause();
                })
                .catch(error => {});
        }
        this.sonExChou.currentTime = 0;
        this.sonGagne.currentTime = 0;
        this.sonGagnePlay = this.sonGagne.play();
        let o = this;
        this.sonGagne.onended = function() {
            o.fadeInRapMusique();
        };
    }

    /**
     * LIRE LE SON EXTRA CHOU
     */
    getExChou() {
        clearInterval(this.fadeinMus);
        clearInterval(this.fadein);
        this.musique.volume = 0.1;
        this.sonVite.volume = 0.5;
        this.sonExChou.currentTime = 0;
        this.sonGagne.currentTime = 0;
        this.sonExChouPlay = this.sonExChou.play();
        let o = this;
        this.sonExChou.onended = function() {
            o.fadeInRapMusique();
        };
    }

    /**
     * FADE IN POUR LA MUSIQUE
     */
    fadeInMusique() {
        let o = this;
        this.fadeinMus = setInterval(
            function() {
                let vol = o.musique.volume;
                if ((vol + 0.09) < 1) {
                    vol += 0.09;
                    o.musique.volume = vol;
                } else {
                    o.musique.volume = 1;
                    clearInterval(this.fadeinMus);
                }
            }, 200);
    }

    /**
     * FADE IN RAPIDE POUR LA MUSIQUE
     */
    fadeInRapMusique() {
        let o = this;
        this.fadein = setInterval(
            function() {
                let vol = o.musique.volume;
                if ((vol + 0.14) < 1) {
                    vol += 0.14;
                    o.musique.volume = vol;
                } else {
                    o.musique.volume = 1;
                    clearInterval(this.fadein);
                }
            }, 200);
    }

    /**
     * RETIRER LE FADE IN
     */
    fadeInSupp() {
        clearInterval(this.fadeinMus);
        clearInterval(this.fadein);
        if (this.sonExChouPlay !== undefined) {
            this.sonExChouPlay.then(_ => {
                    this.sonExChou.pause();
                })
                .catch(error => {});
        }
        if (this.sonGagnePlay !== undefined) {
            this.sonGagnePlay.then(_ => {
                    this.sonGagne.pause();
                })
                .catch(error => {});
        }
        this.musique.volume = 1
    }

    /**
     * LIRE LE SON SCORE
     */
    getScore() {
        if (this.sonScore.currentTime > 0.03) this.sonScore.currentTime = 0;
        this.sonScore.play();
    }

    /**
     *  AJOUTER LES SOURCES AUX DIFFERENTS FORMATS
     */
    creerSrc(tabSrc, objJoue) {
        for (let i = 0; i < tabSrc.length; i++) {
            let elemSrc = document.createElement('source');
            elemSrc.setAttribute('src', tabSrc[i]);
            if (tabSrc[i].split(".", 1) === "ogg") elemSrc.setAttribute('type', "audio/ogg");
            else if (this.srcMusique[i].split(".", 1) === "mp3") elemSrc.setAttribute('type', "audio/mpeg");
            objJoue.appendChild(elemSrc);
        }
    }

    /***
     * RÉCUPÉRER L'AUDIO SAUVEGARDÉ
     */
    getAudioMem() {
        let retour = { 'audio': -1, 'musique': -1 };
        try {
            if (typeof localStorage === 'undefined') {} else {
                let musique, audio;
                (window.localStorage.getItem("audio") === '' || window.localStorage.getItem("audio") === null) ? audio = 0: audio = window.localStorage.getItem("audio");
                (window.localStorage.getItem("musique") === '' || window.localStorage.getItem("musique") === null) ? musique = 1: musique = window.localStorage.getItem("musique");
                retour.audio = audio;
                retour.musique = musique;
            }
        } catch (e) {} finally {
            return retour;
        }
    }

    /***
     * SAUVEGARDER L'AUDIO
     */
    setAudioMem(audio, musique) {
        let retour = -1;
        try {
            if (audio == -1) {} else window.localStorage.setItem("audio", audio);
            if (musique == -1) {} else window.localStorage.setItem("musique", musique);
            retour = 0;
        } catch (e) {
            retour = -1;
        } finally {
            return retour;
        }
    }
}