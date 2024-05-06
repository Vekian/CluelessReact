export default function Paginator(props) {

    function getPageNumber (props) {
        let string= props.pagination['hydra:last'];
        let numberPage = 1;
        if (string) {
            let indexPage= string.indexOf("page=");
            numberPage = parseInt(string.slice(indexPage + 5));
        }
        
        return numberPage;
    }

    function getPages(props) {
        let numberPage = getPageNumber(props);
        let array = [];

        for (let i=1 ; i <= numberPage; i++){
            if (i <= 5) {
                array.push(i)
            }
            else {
                array.push("...");
                array.push(numberPage);
                break;
            }
        }
        return array;
    }

    function encodeArg(arg) {
        let encodedArg = arg.replace(/%5B/g, '[').replace(/%5D/g, ']');
        return encodedArg
    }

    function changeFilterData(page) {
        let newPage = "";
        let newFilter = "";
        if (props.filter[1] === "") {
            newPage = `?page=${page}`;
        }
        else {
            newPage = `&page=${page}`;
            newFilter = props.filter[1];
        }
        props.changeFilter([newPage, newFilter]);
    }

    return( 
        <ul className='d-flex listPages mt-1 ms-2'>
            {props.pagination && getPages(props).map(page => 
                page !== "..." ? 
                <li key={page + "page"} className={`pageItem ${ (encodeArg(props.pagination['@id']) ===`/api/questions${props.filter[1] === "" ? "?" : `${props.filter[1]}&` }page=${page}` || encodeArg(props.pagination['@id']) ===`/api/clues${props.filter[1] === "" ? "?" : `${props.filter[1]}&` }page=${page}`) && "active"}`} onClick={(event) => changeFilterData(page)}>{page}</li>
                : 
                <li key={page + "page"}>{page}</li>)}
        </ul>
    )
}