"use strict";

class LimaceEl extends Element {
    /**
     * CONSTRUCTEUR DE LA LIMACE
     * @param {*Le chamin relatif de l'image de la limace} src
     * @param {*Largeur de la limace} imgW
     * @param {*Hauteur de la limace} imgH
     * @param {*Le plateau pour le positionner} plateau 
     * @param {*La position horizontale de la limace} x
     * @param {*La position verticale de la limace} y
     */
    constructor(src, imgW, imgH, plateau, x, y) {
            var img = new Image(imgW, imgH);
            img.src = src;
            super("limace", plateau, x, y, imgW, imgH);
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