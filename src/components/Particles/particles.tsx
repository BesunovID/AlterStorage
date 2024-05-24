import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { changeDirection } from '../../store/actions/particlesActions';
import style from './Particles.module.scss'

export function Particles() {
    const visable = !document.hidden;
    const initial = useRef(false);
    const dispatch = useAppDispatch();
    const particles = useAppSelector(state => state.particles.particles);

    useEffect(() => {
        if (visable) {
            if (initial.current){
                const timeoutID = setTimeout(() => dispatch(changeDirection(particles)), 2000)
                return () => clearTimeout(timeoutID);
            } else {
                const timeoutID = setTimeout(() => dispatch(changeDirection(particles)));
                initial.current = true;
                setTimeout(() => {return () => clearTimeout(timeoutID)}, 2000);
            }
        } else {
            initial.current = false;
        }
    }, [particles, visable])
    

    return(
        <div className={style.particles}>
            {(particles.length > 1) && particles.map((e, index) => (
                <div key={index} className={style.particle} style={
                    {
                    top: 0,
                    left: 0,
                    width: `${e.size}px`, 
                    height: `${e.size}px`, 
                    borderRadius: `${e.size/2}px`,
                    transition: `transform 2s linear`,
                    transform: `translate(${e.x}vw, ${e.y}vh)`
                    }}>
                </div>
            ))}
        </div>
    )
}