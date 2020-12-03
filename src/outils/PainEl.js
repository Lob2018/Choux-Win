"use strict";

class PainEl extends Element {
    /**
     * CONSTRUCTEUR DU PAIN
     * @param {*Le chamin relatif de l'image du pain} src
     * @param {*Largeur du pain} imgW
     * @param {*Hauteur du pain} imgH
     * @param {*Le plateau pour le positionner} plateau 
     * @param {*La position horizontale du pain} x
     * @param {*La position verticale du pain} y
     */
    constructor(src, imgW, imgH, plateau, x, y) {
            // INITIALISER
            var img = new Image(imgW, imgH);
            img.src = src;

            super("pain", plateau, x, y, imgW, imgH, x, y, 0);
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