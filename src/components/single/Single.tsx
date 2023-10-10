import "./single.scss"

type Props = {
    id:number;
    img?:string;
    title:string;
    info:object;
    activities?: { time: string; text: string }[];
}

const Single = (props:Props) => {
    return (
        <div className="single">
            <div className="view">
            <div className="info">
                <div className="topInfo">
                    {props.img && <img src={props.img} alt="" />}
                    <h1>{props.title}</h1>
                    <button>Update</button>
                </div>
                <div className="details">
                    {Object.entries(props.info).map((item) => (
                    <div className="item" key={item[0]}>
                        <span className="itemTitle">{item[0]}</span>
                        <span className="itemValue">{item[1]}</span>
                    </div>
                    ))}
                </div>
            </div>
            </div>
            <div className="activities">
                <h2>Job Description</h2>
                {props.activities && (
                    <ul>
                        {props.activities.map((activity) => (
                            <li key={activity.text}>
                                <div>
                                    <p>{activity.text}</p>
                                    <time>{activity.time}</time>
                                </div>
                            </li>
                    ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default Single