import Input from "./ui/Input"
import Button from "./ui/Button"

const Form = () => {
    return (
        <>
            <div className="d-flex flex-column gap-4 align-items-md-center" id="booking-form">
                <Input name='name' type="text" placeholder="Имя*" size="large" />
                <Input name="email" type="email" placeholder="Email*" size="large" />
                <Input name="tel" type="tel" placeholder="Телефон*" size="large" pattern="^\+7[1-9]{10}$" />
                <Input name='date' type="date" placeholder="Дата*" size="large" min={"today"} />
                <Input name='time' type="time" placeholder="Время*" size="large" />
                <Input name='count' type="number" placeholder="Кол-во персон*" size="large" min={"1"} max={"10"} />
                <Input name='comment' type="text" placeholder="Комментарий" size="large" />
            </div>

            <div className="d-flex flex-column align-items-center align-items-lg-start mt-5">
                <Button text="Отправить" />
            </div>
        </>
    )
}

export default Form