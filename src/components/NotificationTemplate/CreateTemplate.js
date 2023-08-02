import React, { useState, useEffect } from 'react'

import ReactQuill from 'react-quill'
import { ClimbingBoxLoader } from 'react-spinners'
import {
  Table,
  Grid,
  InputAdornment,
  Card,
  Menu,
  MenuItem,
  Button,
  List,
  ListItem,
  TextField,
  FormControl,
  Select,
  Snackbar,
  Switch
} from '@material-ui/core'
import apicaller from 'helper/Apicaller'
import BlockUi from 'react-block-ui'
import { BASEURL } from 'config/conf'

import {
  EditorState,
  convertToRaw,
  Modifier,
  ContentState,
  convertFromHTML
} from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import styled from 'styled-components'
import { NavLink, useLocation, useHistory } from 'react-router-dom'
import htmlToDraft from 'html-to-draftjs'
import { Autocomplete } from '@material-ui/lab'

export default function CreateTemplate (props) {
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  )
  const [ackEditorState, setAckEditorState] = React.useState(
    EditorState.createEmpty()
  )
  const [editor, setEditor] = useState()
  const [ackEditor, setAckEditor] = useState()
  const [HtmlMarkup, setHtmlMarkup] = useState()
  const [ackHtmlMarkup, setAckHtmlMarkup] = useState()
  const [variables, setAllVariables] = useState([
  ])

  const onEditorStateChange = (editorState,htmlSetter,editorSetter) => {
    editorSetter(editorState)
    const contentState = editorState.getCurrentContent()
    const rawContentState = convertToRaw(contentState)
    const markup = draftToHtml(rawContentState)
    htmlSetter(markup)
    console.log(markup)
    return markup
  }
  const focusEditor = () => {
    if (editor) {
      editor.focusEditor()
      console.log('1. Editor has the focus now')
    }
  }

  const sendTextToEditor = text => {
    setEditorState(insertText(text, editorState))
    focusEditor()
  }

  const insertText = (text, editorState) => {
    const currentContent = editorState.getCurrentContent(),
      currentSelection = editorState.getSelection()

    const newContent = Modifier.replaceText(
      currentContent,
      currentSelection,
      text
    )

    const newEditorState = EditorState.push(
      editorState,
      newContent,
      'insert-characters'
    )
    return EditorState.forceSelection(
      newEditorState,
      newContent.getSelectionAfter()
    )
  }

  const [isSubmitted, setIsSubmitted] = useState()
  const [isMailSubmitted, setIsMailSubmitted] = useState()
  const [blocking, setBlocking] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const uuid = queryParams.get('uuid') || null
  const readOnly = queryParams.get('readOnly')?.toLowerCase() == 'true' || false
  const edit = uuid ? true : false
  const saveButtonLabel = edit ? 'Update' : 'Save'
  const [notificationType, setNotificationType] = useState()
  const [description, setDescription] = useState()
  const [subject, setSubject] = useState()
  const [ifSendMail, setIfSendMail] = useState(false)
  const [mailTo, setMailTo] = useState()

  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })
  const { vertical, horizontal, open, toastrStyle, message } = state

  const [allNotificationTypes, setAllNotificationTypes] = useState([])
  const [notificationTypes, setNotificationTypes] = useState([])
  const [notificationTypeIndex, setNotificationTypeIndex] = useState(null)
  const [recepients,setRecepients]=useState([]);
  const [allDesigntaion, setAllDesigntaion] = useState([])
  const [allRoles, setAllRoles] = useState([])
  
  //to related variables
  const [toRecepients,setToRecepients]=useState([]);
  const [toRoleUUIDs,setToRoleUUIDs]=useState([]);
  const [toDesignationIDs,setToDesignationIDs]=useState([]);
  const [isToRoleSelected, setToRoleSelected] = useState(false)
  const [isToDesignationSelected, setToDesignationSelected] = useState(false)

  //cc related variables
  const [ccRecepients,setCcRecepients]=useState([]);
  const [ccRoleUUIDs,setCcRoleUUIDs]=useState([]);
  const [ccDesignationIDs,setCcDesignationIDs]=useState([]);
  const [isCcRoleSelected, setCcRoleSelected] = useState(false)
  const [isCcDesignationSelected, setCcDesignationSelected] = useState(false)

  //bcc related variables
  const [bccRecepients,setBccRecepients]=useState([]);
  const [bccRoleUUIDs,setBccRoleUUIDs]=useState([]);
  const [bccDesignationIDs,setBccDesignationIDs]=useState([]);
  const [isBccRoleSelected, setBccRoleSelected] = useState(false)
  const [isBccDesignationSelected, setBccDesignationSelected] = useState(false)

  //ack related variables
  const [ackToRecepients,setAckToRecepients]=useState([]);
  const [ackToRoleUUIDs,setAckToRoleUUIDs]=useState([]);
  const [ackToDesignationIDs,setAckToDesignationIDs]=useState([]);
  const [isAckToRoleSelected, setAckToRoleSelected] = useState(false)
  const [isAckToDesignationSelected, setAckToDesignationSelected] = useState(false)

  //cc related variables
  const [ackCcRecepients,setAckCcRecepients]=useState([]);
  const [ackCcRoleUUIDs,setAckCcRoleUUIDs]=useState([]);
  const [ackCcDesignationIDs,setAckCcDesignationIDs]=useState([]);
  const [isAckCcRoleSelected, setAckCcRoleSelected] = useState(false)
  const [isAckCcDesignationSelected, setAckCcDesignationSelected] = useState(false)

  //bcc related variables
  const [ackBccRecepients,setAckBccRecepients]=useState([]);
  const [ackBccRoleUUIDs,setAckBccRoleUUIDs]=useState([]);
  const [ackBccDesignationIDs,setAckBccDesignationIDs]=useState([]);
  const [isAckBccRoleSelected, setAckBccRoleSelected] = useState(false)
  const [isAckBccDesignationSelected, setAckBccDesignationSelected] = useState(false)

  let allTypes=[];
  let allRecepients=[]
  let roles=[]
  let designations=[]
  useEffect(() => {
    getNotificationTemplateMetaData()
    getTemplateVariables()
    getNotificationTemplates()
  }, [])

  const getNotificationTemplateMetaData=()=>{
    apicaller('get', `${BASEURL}/sendMail/getMailNotificationConstants`)
    .then(res => {
      if (res.status === 200) {
        allRecepients=res.data.mailRecepients
        setRecepients(res.data.mailRecepients)
        allTypes=res.data.notificationTypes
        setAllNotificationTypes(res.data.notificationTypes,getDesignations());
      }
    })
    .catch(err => {
      console.log('getDesignation err', err)
    })

  }
  const getDesignations = () => {
    apicaller('get', `${BASEURL}/designation/fetchAll`)
      .then(res => {
        if (res.status === 200) {
          designations=res.data;
          setAllDesigntaion(res.data,getRoles())
        }
      })
      .catch(err => {
        console.log('getDesignation err', err)
      })
  }
  const getRoles = () => {
    apicaller('get', `${BASEURL}/role`)
        .then((res) => {
            if (res.status === 200) {
              roles=res.data
              if(edit){
                setAllRoles(res.data,getTemplate());
              }
              else{
                setAllRoles(res.data);
              }
            }
        })
        .catch((err) => {
            console.log('getRoles err', err);
        });
  };

  const getTemplate=()=>{
    apicaller('get', `${BASEURL}/sendMail/fetchByUUID?uuid=` + uuid).then(
      res => {
        if (res.status === 200) {
          const index=allTypes.findIndex(type=>type.toLowerCase()===res.data?.notificationType.toLowerCase())
          if(index!=-1){
            setNotificationTypeIndex(index);
          }
          else{
            setNotificationTypeIndex(null);
          }
          setNotificationType(res.data?.notificationType)
          setSubject(res.data?.subject)
          setDescription(res.data?.description)

          const blocksFromHtml = htmlToDraft(res.data?.body)
          const { contentBlocks, entityMap } = blocksFromHtml
          const contentState = ContentState.createFromBlockArray(
            contentBlocks,
            entityMap
          )
          setEditorState(EditorState.createWithContent(contentState))
          const rawContentState = convertToRaw(contentState)
          const markup = draftToHtml(rawContentState)
          setHtmlMarkup(markup)

          const ackBlocksFromHtml = htmlToDraft(res.data?.acknowledgementBody?res.data?.acknowledgementBody:"")
          // const { ackContentBlocks, ackEntityMap } = ackBlocksFromHtml
          const ackContentState = ContentState.createFromBlockArray(
            ackBlocksFromHtml?.contentBlocks,
            ackBlocksFromHtml?.entityMap
          )
          setAckEditorState(EditorState.createWithContent(ackContentState))
          const ackRawContentState = convertToRaw(ackContentState)
          const ackMarkup = draftToHtml(ackRawContentState)
          setAckHtmlMarkup(ackMarkup)

          if(res.data?.notificationTo?.length>0){
            res.data.notificationTo.forEach((mailto)=>{
              if(mailto.type.toLowerCase()==="TO".toLowerCase()){
                setToRecepients(mailto.recepients)
                const roleIndex=mailto.recepients.findIndex(val=>val.toLowerCase()==="Role".toLowerCase())
                const designationIndex=mailto.recepients.findIndex(val=>val.toLowerCase()==="Designation".toLowerCase())
                setToDesignationSelected(designationIndex!=-1)
                if(roleIndex!=-1){
                  setToRoleSelected(true);
                  setToRoleUUIDs(roles.filter(role=>mailto.roleUUIDs.find(uuid=>uuid===role.uuid)!=null))
                }
                if(designationIndex!=-1){
                  setToDesignationSelected(true);
                  setToDesignationIDs(designations.filter(des=>mailto.designationIDs.find(id=>id===des.id)!=null))
                }
              }
              if(mailto.type.toLowerCase()==="CC".toLowerCase()){
                setCcRecepients(mailto.recepients)
                const roleIndex=mailto.recepients.findIndex(val=>val.toLowerCase()==="Role".toLowerCase())
                const designationIndex=mailto.recepients.findIndex(val=>val.toLowerCase()==="Designation".toLowerCase())
                if(roleIndex!=-1){
                  setCcRoleSelected(true);
                  setCcRoleUUIDs(roles.filter(role=>mailto.roleUUIDs.find(uuid=>uuid===role.uuid)!=null))
                }
                if(designationIndex!=-1){
                  setCcDesignationSelected(true);
                  setCcDesignationIDs(designations.filter(des=>mailto.designationIDs.find(id=>id===des.id)!=null))
                }
              }
              if(mailto.type.toLowerCase()==="BCC".toLowerCase()){
                setBccRecepients(mailto.recepients)
                const roleIndex=mailto.recepients.findIndex(val=>val.toLowerCase()==="Role".toLowerCase())
                const designationIndex=mailto.recepients.findIndex(val=>val.toLowerCase()==="Designation".toLowerCase())
                if(roleIndex!=-1){
                  setBccRoleSelected(true);
                  setBccRoleUUIDs(roles.filter(role=>mailto.roleUUIDs.find(uuid=>uuid===role.uuid)!=null))
                }
                if(designationIndex!=-1){
                  setBccDesignationSelected(true);
                  setBccDesignationIDs(designations.filter(des=>mailto.designationIDs.find(id=>id===des.id)!=null))
                }
              }
            })
          }

          if(res.data?.acknowledgeTo?.length>0){
            res.data.acknowledgeTo.forEach((mailto)=>{
              if(mailto.type.toLowerCase()==="TO".toLowerCase()){
                setAckToRecepients(mailto.recepients)
                const roleIndex=mailto.recepients.findIndex(val=>val.toLowerCase()==="Role".toLowerCase())
                const designationIndex=mailto.recepients.findIndex(val=>val.toLowerCase()==="Designation".toLowerCase())
                setAckToDesignationSelected(designationIndex!=-1)
                if(roleIndex!=-1){
                  setAckToRoleSelected(true);
                  setAckToRoleUUIDs(roles.filter(role=>mailto.roleUUIDs.find(uuid=>uuid===role.uuid)!=null))
                }
                if(designationIndex!=-1){
                  setAckToDesignationSelected(true);
                  setAckToDesignationIDs(designations.filter(des=>mailto.designationIDs.find(id=>id===des.id)!=null))
                }
              }
              if(mailto.type.toLowerCase()==="CC".toLowerCase()){
                setAckCcRecepients(mailto.recepients)
                const roleIndex=mailto.recepients.findIndex(val=>val.toLowerCase()==="Role".toLowerCase())
                const designationIndex=mailto.recepients.findIndex(val=>val.toLowerCase()==="Designation".toLowerCase())
                if(roleIndex!=-1){
                  setAckCcRoleSelected(true);
                  setAckCcRoleUUIDs(roles.filter(role=>mailto.roleUUIDs.find(uuid=>uuid===role.uuid)!=null))
                }
                if(designationIndex!=-1){
                  setAckCcDesignationSelected(true);
                  setAckCcDesignationIDs(designations.filter(des=>mailto.designationIDs.find(id=>id===des.id)!=null))
                }
              }
              if(mailto.type.toLowerCase()==="BCC".toLowerCase()){
                setAckBccRecepients(mailto.recepients)
                const roleIndex=mailto.recepients.findIndex(val=>val.toLowerCase()==="Role".toLowerCase())
                const designationIndex=mailto.recepients.findIndex(val=>val.toLowerCase()==="Designation".toLowerCase())
                if(roleIndex!=-1){
                  setAckBccRoleSelected(true);
                  setAckBccRoleUUIDs(roles.filter(role=>mailto.roleUUIDs.find(uuid=>uuid===role.uuid)!=null))
                }
                if(designationIndex!=-1){
                  setAckBccDesignationSelected(true);
                  setAckBccDesignationIDs(designations.filter(des=>mailto.designationIDs.find(id=>id===des.id)!=null))
                }
              }
            })
          }
        }
      }
    )
  }

  const getNotificationTemplates = () => {
    setBlocking(true)
    apicaller('get', `${BASEURL}/sendMail/getallMailTemplatesLite`)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          console.log('res.data', res.data)
          if(!edit){
            const filteredNotificationTypes=allTypes.filter(type=>!res.data.find(template=>template.notificationType.toLowerCase()==type.toLowerCase()))
            setNotificationTypes(filteredNotificationTypes);  
          }
          else{
            setNotificationTypes(allTypes);  
          }
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('getNotificationTemplates err', err)
      })
  }

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  const save = e => {
    e.preventDefault()
    setIsSubmitted(true)
    if (
      notificationType &&
      subject &&
      editorState.getCurrentContent().hasText()
    ) {
      const notificationTo=[];
      if(toRecepients.length>0){
        const roleUUIDs=[];
        const designationIDs=[];
        if(toRoleUUIDs.length>0){
          toRoleUUIDs.forEach(role=>roleUUIDs.push(role.uuid));
        }
        if(toDesignationIDs.length>0){
          toDesignationIDs.forEach(des=>designationIDs.push(des.id));
        }
        const obj={
          type:"TO",
          recepients:toRecepients,
          roleUUIDs:isToRoleSelected?roleUUIDs:[],
          designationIDs:isToDesignationSelected? designationIDs:[]
        }
        notificationTo.push(obj);
      }
      if(ccRecepients.length>0){
        const roleUUIDs=[];
        const designationIDs=[];
        if(ccRoleUUIDs.length>0){
          ccRoleUUIDs.forEach(role=>roleUUIDs.push(role.uuid));
        }
        if(ccDesignationIDs.length>0){
          ccDesignationIDs.forEach(des=>designationIDs.push(des.id));
        }
        const obj={
          type:"CC",
          recepients:ccRecepients,
          roleUUIDs:isCcRoleSelected?roleUUIDs:[],
          designationIDs:isCcDesignationSelected?designationIDs:[]
        }
        notificationTo.push(obj);
      }
      if(bccRecepients.length>0){
        const roleUUIDs=[];
        const designationIDs=[];
        if(bccRoleUUIDs.length>0){
          bccRoleUUIDs.forEach(role=>roleUUIDs.push(role.uuid));
        }
        if(bccDesignationIDs.length>0){
          bccDesignationIDs.forEach(des=>designationIDs.push(des.id));
        }
        const obj={
          type:"BCC",
          recepients:bccRecepients,
          roleUUIDs:isBccRoleSelected?roleUUIDs:[],
          designationIDs:isBccDesignationSelected?designationIDs:[]
        }
        notificationTo.push(obj);
      }

      const acknowledgeTo=[];
      if(ackToRecepients.length>0){
        const roleUUIDs=[];
        const designationIDs=[];
        if(ackToRoleUUIDs.length>0){
          ackToRoleUUIDs.forEach(role=>roleUUIDs.push(role.uuid));
        }
        if(ackToDesignationIDs.length>0){
          ackToDesignationIDs.forEach(des=>designationIDs.push(des.id));
        }
        const obj={
          type:"TO",
          recepients:ackToRecepients,
          roleUUIDs:isAckToRoleSelected?roleUUIDs:[],
          designationIDs:isAckToDesignationSelected? designationIDs:[]
        }
        acknowledgeTo.push(obj);
      }
      if(ackCcRecepients.length>0){
        const roleUUIDs=[];
        const designationIDs=[];
        if(ackCcRoleUUIDs.length>0){
          ackCcRoleUUIDs.forEach(role=>roleUUIDs.push(role.uuid));
        }
        if(ackCcDesignationIDs.length>0){
          ackCcDesignationIDs.forEach(des=>designationIDs.push(des.id));
        }
        const obj={
          type:"CC",
          recepients:ackCcRecepients,
          roleUUIDs:isAckCcRoleSelected?roleUUIDs:[],
          designationIDs:isAckCcDesignationSelected?designationIDs:[]
        }
        acknowledgeTo.push(obj);
      }
      if(ackBccRecepients.length>0){
        const roleUUIDs=[];
        const designationIDs=[];
        if(ackBccRoleUUIDs.length>0){
          ackBccRoleUUIDs.forEach(role=>roleUUIDs.push(role.uuid));
        }
        if(ackBccDesignationIDs.length>0){
          ackBccDesignationIDs.forEach(des=>designationIDs.push(des.id));
        }
        const obj={
          type:"BCC",
          recepients:ackBccRecepients,
          roleUUIDs:isAckBccRoleSelected?roleUUIDs:[],
          designationIDs:isAckBccDesignationSelected?designationIDs:[]
        }
        acknowledgeTo.push(obj);
      }
      let data = {
        notificationType: notificationType,
        notificationTo:notificationTo,
        description: description,
        subject: subject,
        body: HtmlMarkup,
        acknowledgementBody:ackHtmlMarkup,
        acknowledgeTo:acknowledgeTo
      }

      if (edit) {
        data.uuid = uuid
        apicaller('patch', `${BASEURL}/sendMail/update`, data)
          .then(res => {
            if (res.status === 200) {
              setState({
                open: true,
                message: 'Udated Successfully',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
              })
              history.push('/notificationTemplate')
            }
          })
          .catch(err => {
            setBlocking(false)
            if (err?.response?.data) {
                setState({
                  open: true,
                  message: err.response.data,
                  toastrStyle: 'toastr-warning',
                  vertical: 'top',
                  horizontal: 'right'
                })
            }
          })
      } else {
        apicaller('post', `${BASEURL}/sendMail/createMailTemplate`, data)
          .then(res => {
            if (res.status === 200) {
              console.log('res.data', res.data)
              setIsSubmitted(false)
              setBlocking(false)
              if (res?.data[0]) {
                setState({
                  open: true,
                  message: 'Template Addded Successfully',
                  toastrStyle: 'toastr-success',
                  vertical: 'top',
                  horizontal: 'right'
                })
                history.push('/notificationTemplate')
              } else {
                setState({
                  open: true,
                  message: res?.data?.errors[0],
                  toastrStyle: 'toastr-warning',
                  vertical: 'top',
                  horizontal: 'right'
                })
              }
            }
          })
          .catch(err => {
            setBlocking(false)
            if (err?.response?.data) {
              if (err?.response?.data.indexOf('dup key') !== -1) {
                setState({
                  open: true,
                  message:  `Notification template for ${notificationType} already exist!`,
                  toastrStyle: 'toastr-warning',
                  vertical: 'top',
                  horizontal: 'right'
                })
              } else
              if (err?.response?.data) {
                setState({
                  open: true,
                  message: err.response.data,
                  toastrStyle: 'toastr-warning',
                  vertical: 'top',
                  horizontal: 'right'
                })
              }
              console.log('create id err', err)
            }
          })
      }
    } else {
      setState({
        open: true,
        message: 'Missing fields are required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
    }
  }



  const getTemplateVariables = () => {
    apicaller('get', `${BASEURL}/letterTemplateVariables/fetch?templateType=MailNotification`)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          console.log('res.data', res.data)
          setAllVariables(res.data)
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('getLetter err', err)
      })
  }

  const sendMail = (e,body) => {
    setIsMailSubmitted(true)
    setIsSubmitted(true)
    if (
      subject &&
      editorState.getCurrentContent().hasText() && mailTo
    ) {
      let data = {
        email: mailTo,
        subject: subject,
        body: body,
      }

      apicaller('post', `${BASEURL}/sendMail/sample`, data)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setIsSubmitted(false)
          setBlocking(false)
          setState({
            open: true,
            message: 'Mail Sent Successfully',
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          })
        }
      })
      .catch(err => {
        setBlocking(false)
        if (err?.response?.data) {
          setState({
            open: true,
            message: err.response.data,
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          })
        }
        console.log('create uuid err', err)
      })

    } else {
      setState({
        open: true,
        message: 'Missing fields are required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
    }
  }

  return (
    <>
      <BlockUi
        tag='div'
        blocking={blocking}
        loader={
          <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
        }>
        <Card className='card-box shadow-none'>
          <div className='p-4'>
            <Grid container spacing={0}>
              <Grid item md={11} lg={11} xl={11} className='mx-auto'>
                <Grid container spacing={6}>
                  <Grid item md={8}>
                    <div>
                      <label className=' mb-2'>Notification Type *</label>
                      <Autocomplete
                      id="combo-box-demo"
                      options={notificationTypes}
                      value={notificationTypeIndex!=null?allNotificationTypes[notificationTypeIndex]:null}
                      disabled={edit}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                      onChange={(event ,value)=> {
                        const index=allNotificationTypes.findIndex(type=>type.toLowerCase()===value?.toLowerCase())
                        if(index!=-1){
                          setNotificationTypeIndex(index);
                        }
                        else{
                          setNotificationTypeIndex(null);
                        }              
                        setNotificationType(value)
                      }}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={12}>
                    <label
                      style={{ marginTop: '15px' }}
                      className='font-weight-normal mb-2'>
                      Description *
                    </label>

                    <TextField
                      fullWidth
                      id='outlined-multiline-flexible'
                      label=''
                      multiline
                      rowsMax='2'
                      placeholder='Description'
                      value={description}
                      onChange={event => {
                        setDescription(event.target.value)
                      }}
                      variant='outlined'
                      error={isSubmitted && (description ? false : true)}
                      helperText={
                        isSubmitted && (!description || description === '')
                          ? 'Description is required'
                          : ''
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={12}>
                    <label
                      style={{ marginTop: '15px' }}
                      className='font-weight-normal mb-2'>
                      Subject *
                    </label>

                    <TextField
                      fullWidth
                      id='outlined-multiline-flexible'
                      label=''
                      multiline
                      rowsMax='2'
                      placeholder='Subject'
                      value={subject}
                      onChange={event => {
                        setSubject(event.target.value)
                      }}
                      variant='outlined'
                      error={isSubmitted && (subject ? false : true)}
                      helperText={
                        isSubmitted && (!subject || subject === '')
                          ? 'Subject is required'
                          : ''
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={12}>
                    <label
                      style={{ marginTop: '15px' }}
                      className='font-weight-normal mb-2 '>
                      Variables
                    </label>

                    <div style={{height:'200px', overflowY:'scroll'}}className='d-flex align-items-center justify-content-center flex-wrap card-box MuiOutlinedInput-root MuiOutlinedInput-notchedOutline'>
                      {variables.map(option => (
                        <Button
                          className='m-2 btn-transparent btn-link btn-link-primary'
                          onClick={sendTextToEditor.bind(this, option.name)}>
                          <span>{option.name}</span>
                        </Button>
                      ))}
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={12}>
                    <label className='mb-2 ' style={{ marginTop: '15px' }}>
                      Body of the Letter *
                    </label>
                    <Editor
                      editorStyle={
                        isSubmitted &&
                        !editorState.getCurrentContent().hasText()
                          ? { minHeight: '400px', border: '1px solid red' }
                          : {
                              minHeight: '400px',
                              border: '1px solid rgba(0, 0, 0, 0.23)'
                            }
                      }
                      ref={setEditor}
                      editorState={editorState}
                      toolbarClassName='toolbarClassName'
                      wrapperClassName='wrapperClassName'
                      editorClassName='editorClassName'
                      onEditorStateChange={event => {
                        onEditorStateChange(event,setHtmlMarkup,setEditorState)
                      }}
                    />
                    <p className='MuiFormHelperText-root MuiFormHelperText-contained Mui-error MuiFormHelperText-marginDense'>
                      {' '}
                      {isSubmitted && !editorState.getCurrentContent().hasText()
                        ? 'Body is Required'
                        : ''}
                    </p>
                  </Grid>
                </Grid>
                <label style={{ marginTop: '15px' }} className='mb-2'>
                  Send Notification To
                </label>
                <Grid container spacing={2}>
                  <Grid item md={4}>
                    <Autocomplete
                      id="combo-box-demo"
                      multiple
                      options={recepients}
                      value={toRecepients}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="To"
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                      onChange={(event, value) => {
                        const roleIndex=value.findIndex(val=>val.toLowerCase()==="Role".toLowerCase())
                        setToRoleSelected(roleIndex!=-1)
                        const designationIndex=value.findIndex(val=>val.toLowerCase()==="Designation".toLowerCase())
                        setToDesignationSelected(designationIndex!=-1)

                        setToRecepients(value);
                      }}
                    />
                  </Grid>
                  {isToRoleSelected&&<Grid item md={4}>
                    <Autocomplete
                      id="combo-box-demo"
                      multiple
                      options={allRoles}
                      value={toRoleUUIDs}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Roles"
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                      onChange={(event, value) => {
                        setToRoleUUIDs(value);
                      }}
                    />
                  </Grid>
                  }
                  {isToDesignationSelected&&<Grid item md={4}>
                  <Autocomplete
                      id="combo-box-demo"
                      multiple
                      options={allDesigntaion}
                      value={toDesignationIDs}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Designations"
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                      onChange={(event, value) => {
                        setToDesignationIDs(value);
                      }}
                    />
                  </Grid>
                  }
                </Grid>
                <br/>
                <Grid container spacing={2}>
                  <Grid item md={4}>
                  <Autocomplete
                      id="combo-box-demo"
                      multiple
                      options={recepients}
                      value={ccRecepients}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="CC"
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                      onChange={(event, value) => {
                        const roleIndex=value.findIndex(val=>val.toLowerCase()==="Role".toLowerCase())
                        setCcRoleSelected(roleIndex!=-1)
                        const designationIndex=value.findIndex(val=>val.toLowerCase()==="Designation".toLowerCase())
                        setCcDesignationSelected(designationIndex!=-1)

                        setCcRecepients(value);
                      }}
                    />
                  </Grid>
                  {isCcRoleSelected&&<Grid item md={4}>
                    <Autocomplete
                      id="combo-box-demo"
                      multiple
                      options={allRoles}
                      value={ccRoleUUIDs}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Roles"
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                      onChange={(event, value) => {
                        setCcRoleUUIDs(value);
                      }}
                    />
                  </Grid>
                  }
                  {isCcDesignationSelected&&<Grid item md={4}>
                  <Autocomplete
                      id="combo-box-demo"
                      multiple
                      options={allDesigntaion}
                      value={ccDesignationIDs}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Designations"
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                      onChange={(event, value) => {
                        setCcDesignationIDs(value);
                      }}
                    />
                  </Grid>
                  }
                </Grid>
                <br/>
                <Grid container spacing={2}>
                  <Grid item md={4}>
                  <Autocomplete
                      id="combo-box-demo"
                      multiple
                      options={recepients}
                      value={bccRecepients}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="BCC"
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                      onChange={(event, value) => {
                        const roleIndex=value.findIndex(val=>val.toLowerCase()==="Role".toLowerCase())
                        setBccRoleSelected(roleIndex!=-1)
                        const designationIndex=value.findIndex(val=>val.toLowerCase()==="Designation".toLowerCase())
                        setBccDesignationSelected(designationIndex!=-1)

                        setBccRecepients(value);
                      }}
                    />
                  </Grid>
                  {isBccRoleSelected&&<Grid item md={4}>
                    <Autocomplete
                      id="combo-box-demo"
                      multiple
                      options={allRoles}
                      value={bccRoleUUIDs}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Roles"
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                      onChange={(event, value) => {
                        setBccRoleUUIDs(value);
                      }}
                    />
                  </Grid>
                  }
                  {isBccDesignationSelected&&<Grid item md={4}>
                  <Autocomplete
                      id="combo-box-demo"
                      multiple
                      options={allDesigntaion}
                      value={bccDesignationIDs}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Designations"
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                      onChange={(event, value) => {
                        setBccDesignationIDs(value);
                      }}
                    />
                  </Grid>
                  }
                </Grid>
                <br></br> 
                <Grid container spacing={6}>
                  <Grid item md={12}>
                    <label className='mb-2 ' style={{ marginTop: '15px' }}>
                      Acknowledgement Body of the Letter
                    </label>
                    <Editor
                      editorStyle={{minHeight: '400px',border: '1px solid rgba(0, 0, 0, 0.23)'}}
                      ref={setAckEditor}
                      editorState={ackEditorState}
                      toolbarClassName='toolbarClassName'
                      wrapperClassName='wrapperClassName'
                      editorClassName='editorClassName'
                      onEditorStateChange={event => {
                        onEditorStateChange(event,setAckHtmlMarkup,setAckEditorState)
                      }}
                    />
                  </Grid>
                </Grid>
                <label style={{ marginTop: '15px' }} className='mb-2'>
                  Send Acknowledgement To
                </label>
                <Grid container spacing={2}>
                  <Grid item md={4}>
                    <Autocomplete
                      id="combo-box-demo"
                      multiple
                      options={recepients}
                      value={ackToRecepients}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="To"
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                      onChange={(event, value) => {
                        const roleIndex=value.findIndex(val=>val.toLowerCase()==="Role".toLowerCase())
                        setAckToRoleSelected(roleIndex!=-1)
                        const designationIndex=value.findIndex(val=>val.toLowerCase()==="Designation".toLowerCase())
                        setAckToDesignationSelected(designationIndex!=-1)

                        setAckToRecepients(value);
                      }}
                    />
                  </Grid>
                  {isAckToRoleSelected&&<Grid item md={4}>
                    <Autocomplete
                      id="combo-box-demo"
                      multiple
                      options={allRoles}
                      value={ackToRoleUUIDs}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Roles"
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                      onChange={(event, value) => {
                        setAckToRoleUUIDs(value);
                      }}
                    />
                  </Grid>
                  }
                  {isAckToDesignationSelected&&<Grid item md={4}>
                  <Autocomplete
                      id="combo-box-demo"
                      multiple
                      options={allDesigntaion}
                      value={ackToDesignationIDs}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Designations"
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                      onChange={(event, value) => {
                        setAckToDesignationIDs(value);
                      }}
                    />
                  </Grid>
                  }
                </Grid>
                <br/>
                <Grid container spacing={2}>
                  <Grid item md={4}>
                  <Autocomplete
                      id="combo-box-demo"
                      multiple
                      options={recepients}
                      value={ackCcRecepients}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="CC"
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                      onChange={(event, value) => {
                        const roleIndex=value.findIndex(val=>val.toLowerCase()==="Role".toLowerCase())
                        setAckCcRoleSelected(roleIndex!=-1)
                        const designationIndex=value.findIndex(val=>val.toLowerCase()==="Designation".toLowerCase())
                        setAckCcDesignationSelected(designationIndex!=-1)

                        setAckCcRecepients(value);
                      }}
                    />
                  </Grid>
                  {isAckCcRoleSelected&&<Grid item md={4}>
                    <Autocomplete
                      id="combo-box-demo"
                      multiple
                      options={allRoles}
                      value={ackCcRoleUUIDs}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Roles"
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                      onChange={(event, value) => {
                        setAckCcRoleUUIDs(value);
                      }}
                    />
                  </Grid>
                  }
                  {isAckCcDesignationSelected&&<Grid item md={4}>
                  <Autocomplete
                      id="combo-box-demo"
                      multiple
                      options={allDesigntaion}
                      value={ackCcDesignationIDs}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Designations"
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                      onChange={(event, value) => {
                        setAckCcDesignationIDs(value);
                      }}
                    />
                  </Grid>
                  }
                </Grid>
                <br/>
                <Grid container spacing={2}>
                  <Grid item md={4}>
                  <Autocomplete
                      id="combo-box-demo"
                      multiple
                      options={recepients}
                      value={ackBccRecepients}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="BCC"
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                      onChange={(event, value) => {
                        const roleIndex=value.findIndex(val=>val.toLowerCase()==="Role".toLowerCase())
                        setAckBccRoleSelected(roleIndex!=-1)
                        const designationIndex=value.findIndex(val=>val.toLowerCase()==="Designation".toLowerCase())
                        setAckBccDesignationSelected(designationIndex!=-1)

                        setAckBccRecepients(value);
                      }}
                    />
                  </Grid>
                  {isAckBccRoleSelected&&<Grid item md={4}>
                    <Autocomplete
                      id="combo-box-demo"
                      multiple
                      options={allRoles}
                      value={ackBccRoleUUIDs}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Roles"
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                      onChange={(event, value) => {
                        setAckBccRoleUUIDs(value);
                      }}
                    />
                  </Grid>
                  }
                  {isAckBccDesignationSelected&&<Grid item md={4}>
                  <Autocomplete
                      id="combo-box-demo"
                      multiple
                      options={allDesigntaion}
                      value={ackBccDesignationIDs}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Designations"
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                      onChange={(event, value) => {
                        setAckBccDesignationIDs(value);
                      }}
                    />
                  </Grid>
                  }
                </Grid>
                <br></br>
                <Switch
                  name='sampleEmail'
                  color='primary'
                  className='switch-small'
                  value={ifSendMail}
                  checked={ifSendMail}
                  onChange={event => {
                    setIfSendMail(event.target.checked)
                    setIsMailSubmitted(false)
                    setMailTo('')
                  }}
                />
                &nbsp; &nbsp;
                <label style={{ marginTop: '15px' }} className='mb-2'>
                  Send Sample Email
                </label>
                <br></br>
                {ifSendMail ? (
                  <Grid
                    item
                    md={12}
                    container
                    className='mx-auto mt-2'
                    direction='row'>
                    {/* <Grid item md={2} className='mx-auto'>
                      <label className='font-weight-normal py-2'>
                        Enter Email Id *
                      </label>
                    </Grid> */}
                    <Grid item md={6} className='mx-auto'>
                      <TextField
                        id='outlined-mailTo'
                        placeholder='Enter Email Id'
                        variant='outlined'
                        fullWidth
                        type="email"
                        size='small'
                        name='mailTo'
                        value={mailTo}
                        onChange={event => {
                          setMailTo(event.target.value)
                        }}
                        helperText={
                          ifSendMail &&
                          isMailSubmitted &&
                          (!mailTo || mailTo === '')
                            ? 'Email Id is required'
                            : ''
                        }
                        error={
                          ifSendMail &&
                          isMailSubmitted &&
                          (!mailTo || mailTo === '')
                            ? true
                            : false
                        }
                      />
                    </Grid>
                    <Grid item md={6} className='mx-auto'>
                      <Button
                        className='btn-neutral-primary ml-2'
                        type='submit'
                        onClick={e => sendMail(e,HtmlMarkup)}>
                        Send Sample Mail
                      </Button>
                      <Button
                        className='btn-neutral-primary ml-2'
                        type='submit'
                        onClick={e => sendMail(e,ackHtmlMarkup)}>
                        Send AcknowledgeMent Mail
                      </Button>
                    </Grid>
                    {/* <Grid item md={3} className='mx-auto'>
                      
                    </Grid> */}
                  </Grid>
                ) : (
                  ''
                )}
                <br/><br></br>
                <div className='divider' />
                <div className='divider' />
                <div className='w-100'>
                  <div className='float-right' style={{ marginRight: '2.5%' }}>
                  <Button
                      className='btn-primary mb-2 m-2'
                      component={NavLink}
                      to='./notificationTemplate'>
                      Cancel
                    </Button>
                    <Button
                      className='btn-primary mb-2 m-2'
                      type='submit'
                      onClick={e => save(e)}>
                      {saveButtonLabel}
                    </Button>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </Card>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key={`${vertical},${horizontal}`}
          open={open}
          classes={{ root: toastrStyle }}
          onClose={handleClose}
          message={message}
          autoHideDuration={2000}
        />
      </BlockUi>
    </>
  )
}
