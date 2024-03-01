import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ParticlesDots } from "../../models/models"

interface ParticlesMovePayload {
    particles: ParticlesDots[]
}

interface ParticlesSlice {
    particles: ParticlesDots[]
}

const initialState: ParticlesSlice = {
    particles: [...Array<ParticlesDots>(30)].map(e => (
        {
        size: Math.round(Math.random()*7) + 1,
        x: (Math.random()*98),
        y: (Math.random()*98),
        deg: +(Math.random() * 360).toFixed()
        }
    ))
}

export const particlesSlice = createSlice({
    name: 'particles',
    initialState,
    reducers: {
        setMove(state, action: PayloadAction<ParticlesMovePayload>) {
            state.particles = action.payload.particles
        }
    }
})

export default particlesSlice.reducer