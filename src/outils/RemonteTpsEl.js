"use strict";

class RemonteTpsEl extends Element {
    /**
     * CONSTRUCTEUR REMONTE LE TEMPS
     * @param {*Le chamin relatif de l'image remonte le temps} src
     * @param {*Largeur remonte le temps} imgW
     * @param {*Hauteur remonte le temps} imgH
     * @param {*Le plateau pour le positionner} plateau 
     * @param {*La position horizontale remonte le temps} x
     * @param {*La position verticale remonte le temps} y
     */
    constructor(src, imgW, imgH, plateau, x, y) {
            var img = new Image(imgW, imgH);
            img.src = src;
            super("remonte", plateau, x, y, imgW, imgH);
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