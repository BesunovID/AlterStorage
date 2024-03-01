import { AppDispatch } from ".."
import { ParticlesDots } from "../../models/models"
import {particlesSlice} from "../slices/particlesSlice"


export const changeDirection = (particlesDots: ParticlesDots[]) => {
    return (dispatch: AppDispatch) => {
        const newParticlesDots = particlesDots.map(e => (
            operation(e)
        ));
        dispatch(particlesSlice.actions.setMove({particles: newParticlesDots}))   
    }
}

const operation = (particleDots: ParticlesDots) => {
    const distanceMax: number = 97;
    const distanceMin: number = 3;
    const step: number = 5;

    let interimShift = {
        deg: particleDots.deg, 
        x: particleDots.x, 
        y: particleDots.y
    };

    interimShift = changeShift(interimShift.deg, step);

    while (Math.abs(particleDots.x + interimShift.x) >= distanceMax || 
    Math.abs(particleDots.y + interimShift.y) >= distanceMax || 
    Math.abs(particleDots.x + interimShift.x) <= distanceMin || 
    Math.abs(particleDots.y + interimShift.y) <= distanceMin) {
        interimShift = changeShift(interimShift.deg, step)
    }
    const newParticle: ParticlesDots = {
        size: particleDots.size,
        x: particleDots.x + interimShift.x,
        y: particleDots.y + interimShift.y,
        deg: interimShift.deg
    } 
    return(newParticle)
}

const changeShift = (deg: number, step: number) => {
    const maxRotate: number = 30;
    return(
        {
        deg: deg + (+(Math.random() * maxRotate * 2 - maxRotate).toFixed()),
        x: shiftDots(deg + (+(Math.random() * maxRotate * 2 - maxRotate).toFixed()), step).x,
        y: shiftDots(deg + (+(Math.random() * maxRotate * 2 - maxRotate).toFixed()), step).y,
        }
    ) 
}

const shiftDots = (deg: number, step: number) => {
    return{
        x: +(Math.cos(deg * Math.PI / 180) * step).toFixed(),
        y: +(Math.sin(deg * Math.PI / 180) * step).toFixed(),
    }
}