import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useAppDispatch } from "../../hooks/redux";
import { IUser, UserEnumField } from "../../models/models";
import { updateUser } from "../../store/actions/usersActions";


export function Profile(props: any) {
    const dispatch = useAppDispatch();
    const [user, setUser] = useState<IUser>(props.user);

    const [isEdit, setIsEdit] = useState<boolean>(false);

    return(
        <Form>
            {Object.entries(user as IUser).map(([key, value]) => (
                (key !== 'id') && (key !== 'password') && 
                <Form.Group key={key}>
                    <Form.Label className="mt-1">{UserEnumField[key as keyof typeof UserEnumField]}</Form.Label>
                    {key !== 'role' ? 
                    <Form.Control 
                        name={key} 
                        value={value} 
                        type='text'
                        readOnly={key === 'username' || !isEdit} 
                        onChange={(newValue) => setUser(prevState => ({
                            ...prevState as IUser,
                            [key]: newValue.target.value,
                        }))}
                    /> : 
                    <Form.Select 
                    value={value} 
                    disabled={!isEdit}
                    onChange={(value) => setUser(prevState => ({
                        ...prevState as IUser,
                        [key]: value.target.value,
                    }))}>
                        <option value='user'>Пользователь</option>
                        <option value='moderator'>Модератор</option>
                        <option value='admin'>Админ</option>
                    </Form.Select>
                    }
                </Form.Group>
            ))}
            {!isEdit && <Button className="d-block mx-auto mt-3" onClick={() => setIsEdit(true)}>Изменить</Button>}
            {isEdit && 
            <div className="buttons d-flex justify-content-center">
                <Button variant="success" className="mt-3 me-2" onClick={() => dispatch(updateUser(user))}>Сохранить</Button>
                <Button variant="danger" className="mt-3" onClick={() => setIsEdit(false)}>Отменить</Button>
            </div>}
        </Form>
    )
}