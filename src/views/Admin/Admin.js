import { HydraAdmin, 
  fetchHydra, 
  hydraDataProvider, 
  FieldGuesser,
  ListGuesser,
  ResourceGuesser } from "@api-platform/admin";
  import { ReferenceField, TextField } from "react-admin";
import { parseHydraDocumentation } from "@api-platform/api-doc-parser";
import { useSelector } from 'react-redux';
import { fetchData, getCookie } from "../../api/APIutils";
import { loadToken, loadUserMe } from "../../features/user/userSlice";
import { useDispatch} from 'react-redux';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";

// Replace with your own API entrypoint
// For instance if https://example.com/api/books is the path to the collection of book resources, then the entrypoint is https://example.com/api
export default function Admin() {
  const dispatch = useDispatch();
  const entrypoint= process.env.REACT_APP_URL + "api";
  const token = useSelector(state => state.user.token);
  const [isSending, setIsSending] = useState( false );
  const dataProvider = hydraDataProvider({
    entrypoint,
    httpClient: fetchHydra,
    apiDocumentationParser: parseHydraDocumentation,
    mercure: true,
    useEmbedded: false,
  });

  useEffect(() => {
    const cookie = getCookie('refresh_token');
    if (cookie){
        const body = {
            refresh_token: cookie
        }
        fetchData('token/refresh', 'POST', loadData, '', body)
    }
    
  }, [])

  function loadData(data) {
    if (data.token) {
        dispatch(loadToken(data.token));
        const userJson = JSON.parse(data.user);
        dispatch(loadUserMe(userJson));

        let cookie = getCookie('refresh_token');
        if (!cookie) {
            cookie = `refresh_token=${data['refresh_token']}`;
            document.cookie = cookie;
            document.getElementById('loginModalClose').click()
            setIsSending(false);
        }
    }
  }


  const CluesList = (props) => (
    <ListGuesser {...props}>
      <ReferenceField label="Author" source="user" reference="users">
        <TextField source="username" />
      </ReferenceField>
      <FieldGuesser source="tags" />
      <FieldGuesser source="title" />
      <FieldGuesser source="content" />
      <FieldGuesser source="popularity" />
      <FieldGuesser source="createdAt" />
    </ListGuesser>
  );

  const AnswersList = (props) => (
    <ListGuesser {...props}>
      <ReferenceField label="Author" source="user" reference="users">
        <TextField source="username" />
      </ReferenceField>
      <ReferenceField label="Question" source="question" reference="questions">
        <TextField source="id" />
      </ReferenceField>
      <FieldGuesser source="content" />
      <FieldGuesser source="popularity" />
      <FieldGuesser source="status" />
      <FieldGuesser source="comments" />
      <FieldGuesser source="createdAt" />
    </ListGuesser>
  );

  const CommentsList = (props) => (
    <ListGuesser {...props}>
      <ReferenceField label="Author" source="user" reference="users">
        <TextField source="username" />
      </ReferenceField>
      <ReferenceField label="Question" source="question" reference="questions">
        <TextField source="id" />
      </ReferenceField>
      <ReferenceField label="Clue" source="clue" reference="clues">
        <TextField source="id" />
      </ReferenceField>
      <FieldGuesser source="content" />
      <FieldGuesser source="popularity" />
      <FieldGuesser source="createdAt" />
    </ListGuesser>
  );

  const QuestionsList = (props) => (
    <ListGuesser {...props}>
      <ReferenceField label="Author" source="user" reference="users">
        <TextField source="username" />
      </ReferenceField>
      <FieldGuesser source="title" />
      <FieldGuesser source="content" />
      <FieldGuesser source="popularity" />
      <FieldGuesser source="status" />
      <FieldGuesser source="answers" />
      <FieldGuesser source="comments" />
      <FieldGuesser source="tags" />
      <FieldGuesser source="createdAt" />
    </ListGuesser>
  );

  return (
    <>
    {
      (token !== "" && jwtDecode(token).roles.includes("ROLE_ADMIN")) ?
       <HydraAdmin entrypoint={ entrypoint } dataProvider={dataProvider} > 
        <ResourceGuesser
          name="questions"
          list={QuestionsList}
        />
        <ResourceGuesser
          name="answers"
          list={AnswersList}
        />
        <ResourceGuesser
          name="comments"
          list={CommentsList}
        />
        <ResourceGuesser
          name="users"
        />
        <ResourceGuesser
          name="clues"
          list={CluesList}
        />
        <ResourceGuesser
          name="categories"
        />
       </ HydraAdmin>
       :
      null
    }
    </>
    
  )
};