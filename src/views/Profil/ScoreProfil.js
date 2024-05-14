import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

export default function ScoreProfil(props) {
    const options = {
        responsive: true,
        plugins: {
            legend: {
            display: false,
            position: "bottom",
            width: "100%"
            },
            tooltip: {
            boxPadding: 6,
            callbacks: {
                afterLabel: function () {
                    return ("points")
                }
            }
            }
        },
    };
    
    ChartJS.register(ArcElement, Tooltip, Legend);

    function parseScoreDataset(categoryMain= null) {
        let scores= props.userProfil.user.scores;
        
        let labels = []
        let data = [];
        let backgroundColor = [];

        for (let i=0; i<scores.length; i++) {
            if (scores[i].category) {
                if (categoryMain && scores[i].category.category?.id === categoryMain?.id){
                    labels.push(scores[i].category.name);
                    data.push(scores[i].points);
                    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
                    backgroundColor.push(randomColor);
                }
                else if (!categoryMain) {
                    labels.push(scores[i].category.name);
                    data.push(scores[i].points);
                    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
                    backgroundColor.push(randomColor);
                }
            }
        }
        let dataset = {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: backgroundColor,
                },
            ],
        }
        return dataset;
    }

    function getBestCategory(){
        let scores = props.userProfil.user.scores;

        let bestScore = scores[0];

        // Parcourir la liste des scores pour trouver le score le plus élevé
        for (let i = 1; i < scores.length; i++) {
            if (scores[i] > bestScore) {
                bestScore = scores[i];
            }
}       return bestScore.category;
    }

    return (
        <div className="d-flex flex-wrap justify-content-around">
            <div className="charts d-flex flex-column align-items-center">
                <h5 className="mb-2">
                    Scores globaux
                </h5>
                {
                    props.userProfil.user.scores && props.userProfil.user.scores.length > 0 ?
                    <Doughnut
                        data={parseScoreDataset()} 
                        options={options}
                    /> : null
                }
            </div>
            {
                props.userProfil.user.scores && props.userProfil.user.scores.length > 0 ?
                <div className="charts d-flex flex-column align-items-center mt-5 mt-lg-0">
                    <h5 className="mb-2">
                        Scores de votre section préférée: {getBestCategory().name}
                    </h5>
                    <Doughnut
                        data={parseScoreDataset(getBestCategory())} 
                        options={options}
                    />
                </div>
                    : null
            }
        </div>
    )
}