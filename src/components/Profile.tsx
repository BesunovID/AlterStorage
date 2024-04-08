import { Container } from "react-bootstrap";
import { useAppSelector } from "../hooks/redux";


export function Profile() {
    const profileData = useAppSelector(state => state.users.myProfile)

    return(
        <Container fluid>
            {
                Object.entries(profileData).map(([key, value]) => (
                    <div className="d-flex">
                        {key !== 'password' && 
                         <p className='p-2 fst-italic'>{key}</p>
                        }
                        {key !== 'password' && 
                         <p className='p-2 text-success fw-bold'>{value ? value : 'Не указан'}</p>
                        }
                    </div>
                ))
            }
        </Container>
    )
}