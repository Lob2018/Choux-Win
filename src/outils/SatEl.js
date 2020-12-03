"use strict";

class SatEl extends Element {
    /**
     * CONSTRUCTEUR DU SATELLITE
     * @param {*Le chamin relatif de l'image du satellite} src
     * @param {*Largeur du satellite} imgW
     * @param {*Hauteur du satellite} imgH
     * @param {*Le plateau pour le positionner} plateau 
     * @param {*La position horizontale du satellite} x
     * @param {*La position verticale du satellite} y
     */
    constructor(src, imgW, imgH, plateau, x, y) {
            var img = new Image(imgW, imgH);
            img.src = src;

            super("sat", plateau, x, y, imgW, imgH);
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