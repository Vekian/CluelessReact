import { ThreeDots } from "react-loader-spinner";
import { useGetCategoriesQuery } from "../../features/api/categorySlice";
import { Link } from "react-router-dom";
import { compareValiditySubscription } from "../../api/APIutils";

export default function Podium(props) {
  const { currentData } = useGetCategoriesQuery();

  function getCategoryScore(e) {
    let filter = ["&page=1", ""];
    if (e.target.value === "general") {
      filter[1] = `?order[points]=desc&exists[category]=false`;
    } else {
      filter[1] = `?order[points]=desc&category=${e.target.value}`;
    }
    props.setFilterScores(filter);
  }

  return (
    <div className="mainPodium mt-4 d-flex flex-wrap">
      {props && props.scores ? (
        <div className="d-flex flex-column col-lg-4 col-10 offset-xxl-0 offset-1 ">
          <div className="h-100 col-12 d-flex align-items-end">
            <div className="h-100 col-4 d-flex flex-column justify-content-end">
              {props.scores.length > 1 && (
                <Link
                  to={`/profils/${props.scores[1].user.id}`}
                  className="text-center linkToProfil"
                  style={{ color: "inherit", textDecoration: "inherit" }}
                >
                  <h5
                    className={`text-dark ${
                      props.scores[1].user.subscriptions &&
                      compareValiditySubscription(
                        props.scores[1].user.subscriptions[0]?.expiredAt
                      ) &&
                      "shiny-text"
                    }`}
                  >
                    {props.scores[1].user.username}{" "}
                    <i
                      className="fa-solid fa-trophy fa-lg"
                      style={{ color: "#9a9996" }}
                    ></i>
                  </h5>
                  <h6 className="mb-1">({props.scores[1].points} points)</h6>
                  <img
                    className="mb-1"
                    src={
                      process.env.REACT_APP_URL_IMG +
                      props.scores[1].user.avatar
                    }
                    alt=""
                    height="50px"
                    width="50px"
                  />
                </Link>
              )}
              <div className="podiumSecond">
                <span className="text-light d-flex align-items-end pb-3 justify-content-center h-100">
                  2
                </span>
              </div>
            </div>
            <div className="h-100 col-4 d-flex flex-column justify-content-end">
              <Link
                to={`/profils/${props.scores[0].user.id}`}
                className="text-center linkToProfil"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                <h5
                  className={`text-dark ${
                    props.scores[0].user.subscriptions &&
                    compareValiditySubscription(
                      props.scores[0].user.subscriptions[0]?.expiredAt
                    ) &&
                    "shiny-text"
                  }`}
                >
                  {props.scores[0].user.username}{" "}
                  <i
                    className="fa-solid fa-trophy fa-xl mb-2"
                    style={{ color: "#FFD43B" }}
                  ></i>
                </h5>
                <h6 className="mb-1">({props.scores[0].points} points)</h6>
                <img
                  className="mb-1 imgFirst"
                  src={
                    process.env.REACT_APP_URL_IMG + props.scores[0].user.avatar
                  }
                  alt=""
                  height="50px"
                  width="50px"
                />
              </Link>
              <div className="podiumFirst">
                <span className="text-light d-flex align-items-end pb-3 justify-content-center h-100">
                  1
                </span>
              </div>
            </div>
            <div className="h-100 col-4 d-flex flex-column justify-content-end">
              {props.scores.length > 2 && (
                <Link
                  to={`/profils/${props.scores[2].user.id}`}
                  className="text-center linkToProfil"
                  style={{ color: "inherit", textDecoration: "inherit" }}
                >
                  <h5
                    className={`text-dark ${
                      props.scores[2].user.subscriptions &&
                      compareValiditySubscription(
                        props.scores[2].user.subscriptions[0]?.expiredAt
                      ) &&
                      "shiny-text"
                    }`}
                  >
                    {props.scores[2].user.username}
                    <i
                      className="fa-solid fa-trophy"
                      style={{ color: "#865e3c" }}
                    ></i>
                  </h5>
                  <h6 className="mb-1">({props.scores[2].points} points)</h6>
                  <img
                    className="mb-1"
                    src={
                      process.env.REACT_APP_URL_IMG +
                      props.scores[2].user.avatar
                    }
                    alt=""
                    height="50px"
                    width="50px"
                  />
                </Link>
              )}
              <div className="podiumThird">
                <span className="text-light d-flex align-items-end pb-3 justify-content-center h-100">
                  3
                </span>
              </div>
            </div>
          </div>
          <div className="text-center pt-2">
            <p>
              Félicitations à {props.scores[0].user.username} qui atteint la
              tête du classement !
            </p>
          </div>
        </div>
      ) : (
        <div className="col-lg-4 col-10 d-flex align-items-center justify-content-center">
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
        </div>
      )}
      <div className="mt-lg-0 mt-5 d-flex col-lg-5 col-10 descriptionContener offset-1">
        <div className="col-12 descriptionPodium d-flex flex-column align-items-center text-center h-100">
          <div className="titleDescription w-100 d-flex justify-content-center pt-2 pb-2">
            <h4 className="me-3">Classement</h4>
            <select
              onInput={(e) => {
                getCategoryScore(e);
              }}
            >
              <option value="general">Général</option>
              {currentData &&
                currentData["hydra:member"].map((category) => (
                  <option
                    key={category.id + "categoryPodium"}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-12 d-flex flex-column align-items-center mt-3 pb-1">
            <div className="d-flex w-100">
              <h5 className="col-3">Position</h5>
              <h5 className="col-4">Pseudo</h5>
              <h5 className="col-5">Popularité</h5>
            </div>
            <div className="d-flex flex-column w-100 tablePodium">
              {props.scores &&
                props.scores.map((score, index) => (
                  <div key={score.id + "score"} className="w-100 d-flex">
                    <h5 className="col-3 fw-normal ">{index + 1}</h5>
                    <h5 className="col-4 fw-normal">
                      <Link
                        to={`/profils/${score.user.id}`}
                        className="text-center fw-bold linkToProfil"
                        style={{ color: "inherit", textDecoration: "inherit" }}
                      >
                        {score.user.username}
                      </Link>
                    </h5>
                    <h5 className="col-5 fw-normal">{score.points} points</h5>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
