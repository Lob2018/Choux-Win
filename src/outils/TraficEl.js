"use strict";

class TraficEl extends Element {
    /**
     * CONSTRUCTEUR DU TRAFIC
     * @param {*Le chamin relatif de l'image du trafic} src
     * @param {*Largeur du trafic} imgW
     * @param {*Hauteur du trafic} imgH     
     * @param {*Le plateau pour le positionner} plateau 
     * @param {*La position horizontale du trafic} x
     * @param {*La position verticale du trafic} y
     */
    constructor(src, imgW, imgH, plateau, x, y) {
            var img = new Image(imgW, imgH);
            img.src = src;

            super("trafic", plateau, x, y, imgW, imgH);
            this.img = img;
            this.w = imgW;
            this.h = imgH;
        }
        /**
         * RÉCUPÉRER L'IMAGE
         */
    getImage() {
        return this.img;
    }

}