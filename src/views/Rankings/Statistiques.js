import { useGetStatsQuery } from "../../features/api/categorySlice";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ThreeDots } from 'react-loader-spinner';
import { useContext } from "react";
import { UIContext } from "../../Components/UIProvider";

export default function Statistiques() {
    const {currentData, error, isFetching} = useGetStatsQuery();
    const { clueMode } = useContext(UIContext);

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      );

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Catégories les plus populaires',
          },
        },
      };

    function parseScoreDataset() {
        const categories = JSON.parse(currentData.categories);
        const categoriesUser = JSON.parse(currentData.categoriesUser);
        let labels = []
        let data = [];
        let backgroundColor = [];

        for (let jsonCategory of categories){
            let category = JSON.parse(jsonCategory);
            labels.push(category.name);
            data.push(category.count);
            let color = "";
            if (clueMode) {
                color = "#054141";
            }
            else {
                color = '#173e6b';
            }
            backgroundColor.push(color);
        }

        let data2 = [];
        let backgroundColor2 = [];
        for (let jsonCategory of categoriesUser) {
            let color = "";
            if (clueMode) {
                color = "#0e8383";
            }
            else {
                color = '#5f84fc';
            }
            let category = JSON.parse(jsonCategory);
            let indexCategory = labels.findIndex(name => name === category.name);
            if(indexCategory > -1) {
                data2[indexCategory] = category.count;
                backgroundColor2[indexCategory]= color;
            }
            else{
                labels.push(category.name);
                data2[data.length - 1] = category.count;
                backgroundColor2[data.length - 1] = color;
            }
        }

        let dataset = {
            labels: labels,
            datasets: [
                {
                    label: 'Pourcentage de Questions/Astuces par catégorie*',
                    data: data,
                    backgroundColor: backgroundColor,
                },
                {
                    label: 'Pourcentage de catégories préférées par les utilisateurs**',
                    data: data2,
                    backgroundColor: backgroundColor2,
                }
            ],
        }
        return dataset;
    }


    return( 
        <div className="text-center mt-5">
            <div>
                <h2>
                    Statistiques
                </h2>
                <p>
                    Voici les catégories les plus populaires
                </p>
            </div>
            <div className="statsContener d-flex flex-wrap w-100">
                <div  className="col-lg-7 col-12 d-flex h-100 justify-content-start">
                   {
                        isFetching ?
                        <ThreeDots
                            visible={true}
                            height="60"
                            width="60"
                            color="#000"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                        :
                        <Bar options={options} data={parseScoreDataset()} />
                    } 
                </div>
                <div className="infosStats col-lg-5 col-12 d-flex flex-column justify-content-center text-start">
                    <p>
                        *Le pourcentage de Questions/Astuces par catégories est calculé à partir du nombre de questions/astuces ayant la catégorie associée.
                    </p>
                    <p>
                        **Tandis que les catégories préférées pour les utilisateurs sont basées sur celles renseignées dans le profil.
                    </p>
                </div>
            </div>
        </div>
    )

}