/**
 * sensory_processor.js
 * 
 * Lógica da Página Autismo
 * Implementa modo sensorial reduzido e filtros CSS para simular sobrecarga sensorial
 */

"use strict";

function modoSensorialReduzido() {
    var toggleBtn = document.getElementById("toggleEffects");
    var body = document.body;

    var sons = [
        "assets/audio/drill-brainrot.mp3",
        "assets/audio/sahur.mp3",
        "assets/audio/polizia.mp3",
        "assets/audio/patapim.mp3",
        "assets/audio/udin-din.mp3"
    ];

    var bgSound = new Audio();
    var somAtivo = false;

    function tocarSomAleatorio() {
        var indice = Math.floor(Math.random() * sons.length);
        bgSound.src = sons[indice];
        bgSound.loop = false;
        bgSound.play().catch(function (error) {
            console.error("Erro ao reproduzir áudio:", error);
        });
    }

    bgSound.addEventListener("ended", tocarSomAleatorio);

    function alternarEfeitos() {
        body.classList.toggle("no-effects");

        if (body.classList.contains("no-effects")) {
            toggleBtn.textContent = "Ativar Modo Sensorial Reduzido";
            bgSound.pause();
            somAtivo = false;
        } else {
            toggleBtn.textContent = "Desativar Modo Sensorial Reduzido";
            if (!somAtivo) {
                tocarSomAleatorio();
                somAtivo = true;
            }
        }
    }

    body.classList.add("no-effects");
    somAtivo = false;

    if (toggleBtn) {
        toggleBtn.addEventListener("click", alternarEfeitos, false);
    }
}

document.addEventListener("DOMContentLoaded", modoSensorialReduzido, false);