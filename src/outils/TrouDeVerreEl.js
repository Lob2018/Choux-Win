"use strict";

class TrouDeVerreEl extends Element {
    /**
     * CONSTRUCTEUR DU TROU DE VERRE
     * @param {*Le chamin relatif de l'image du trou de verre} src
     * @param {*Largeur du trou de verre} imgW
     * @param {*Hauteur du trou de verre} imgH     
     * @param {*Le plateau pour le positionner} plateau 
     * @param {*La position horizontale du trou de verre} x
     * @param {*La position verticale du trou de verre} y
     */
    constructor(src, imgW, imgH, plateau, x, y) {
            var img = new Image(imgW, imgH);
            img.src = src;

            super("trouDeVerre", plateau, x, y, imgW, imgH);
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