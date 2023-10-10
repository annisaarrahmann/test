import Homepage from "../../components/homepage/Homepage"
import TopBox from "../../components/topBox/TopBox"
import "./home.scss"

const Home = () => {
    return (
        <div className="home">
            <div className="box box 1"><TopBox /></div>
            <div className="box box 2"><Homepage /></div>
        </div>
    )
}

export default Home