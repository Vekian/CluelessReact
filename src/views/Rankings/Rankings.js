import './Rankings.css';
import { useGetScoresQuery } from '../../features/api/scoreSlice';
import React, { useState } from 'react';
import Podium from './Podium';
import Statistiques from './Statistiques';

function Rankings() {
  const [filterScores, setFilterScores] = useState(["&page=1", "?order[points]=desc&exists[category]=false"]);
  const {currentData, error, isFetching, isSuccess} =  useGetScoresQuery({ page: filterScores[0], filter: filterScores[1]});
    /*const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Bar Chart',
          },
        },
      };
    
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    
    const data = {
        labels,
        datasets: [
          {
            label: 'Dataset 1',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      };*/

    return (
        <div>
          <div>
            <div className='text-center d-flex flex-column'>
                <h2>
                    Classements
                </h2>
                <p>
                  Ici est affiché le classement des membres les plus actifs de la communauté, félicitations à eux !  
                </p>
            </div>
            <div>
              < Podium setFilterScores={setFilterScores} scores={currentData ? currentData['hydra:member'] : null} />
            </div>
          </div>
          <div className='d-flex justify-content-center mt-5'>
            < Statistiques />
          </div>
        </div>
    )
}

export default Rankings;