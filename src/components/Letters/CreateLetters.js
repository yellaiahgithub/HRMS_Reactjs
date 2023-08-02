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
  Snackbar
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

export default function CreateLetter (props) {
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  )
  const [editor, setEditor] = useState()
  const [HtmlMarkup, setHtmlMarkup] = useState()

  const getValues = e => {
    console.log(e)
  }

  const [variables, setAllVariables] = useState([])

  const onEditorStateChange = editorState => {
    setEditorState(editorState)
    const contentState = editorState.getCurrentContent()
    const rawContentState = convertToRaw(contentState)
    const markup = draftToHtml(rawContentState)
    setHtmlMarkup(markup)
    console.log(markup)
    return markup
  }

  const componentDidMount = () => {
    focusEditor()
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
  const [blocking, setBlocking] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const uuid = queryParams.get('uuid') || null
  const readOnly = queryParams.get('readOnly')?.toLowerCase() == 'true' || false
  const edit = uuid ? true : false
  const saveButtonLabel = edit ? 'Update' : 'Save'
  const [letterName, setLetterName] = useState()
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })
  const { vertical, horizontal, open, toastrStyle, message } = state
  const handleClose = () => {
    setState({ ...state, open: false })
  }

  const save = e => {
    e.preventDefault()
    setIsSubmitted(true)
    if (letterName && editorState.getCurrentContent().hasText()) {
      let data = { name: letterName, body: HtmlMarkup }

      if (edit) {
        data.uuid = uuid
        apicaller('put', `${BASEURL}/letterTemplate/update`, data)
          .then(res => {
            if (res.status === 200) {
              setState({
                open: true,
                message: 'Udated Successfully',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
              })
              history.push('/letters')
            }
          })
          .catch(err => {
            setBlocking(false)
            if (err?.response?.data) {
              if (err?.response?.data.indexOf('to be unique') !== -1) {
                setState({
                  open: true,
                  message: err?.response?.data,
                  toastrStyle: 'toastr-warning',
                  vertical: 'top',
                  horizontal: 'right'
                })
              } else
                setState({
                  open: true,
                  message: err,
                  toastrStyle: 'toastr-success',
                  vertical: 'top',
                  horizontal: 'right'
                })
              console.log('create id err', err)
            }
          })
      } else {
        apicaller('post', `${BASEURL}/letterTemplate/save`, data)
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
                history.push('/letters')
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
            setState({
              open: true,
              message: err,
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            })
            console.log('create uuid err', err)
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

  useEffect(() => {
    getTemplateVariables()

    if (edit) {
      apicaller('get', `${BASEURL}/letterTemplate/fetch?uuid=` + uuid).then(
        res => {
          if (res.status === 200) {
            setLetterName(res.data?.name)

            const blocksFromHtml = htmlToDraft(res.data?.body);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            setEditorState(EditorState.createWithContent(contentState));
            // In update functionality body (HtmlMarkup) was undefined - So adding this
            const rawContentState = convertToRaw(contentState)
            const markup = draftToHtml(rawContentState)
            setHtmlMarkup(markup)
          }
        }
      )
    }
  }, [])

  const getTemplateVariables = () => {
    apicaller('get', `${BASEURL}/letterTemplateVariables/fetch?templateType=Letter`)
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
              <Grid item md={10} lg={10} xl={10} className='mx-auto'>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <label
                      style={{ marginTop: '15px' }}
                      className='font-weight-normal mb-2'>
                      Name of the Letter
                    </label>
                    <TextField
                      uuid='outlined-letterName'
                      placeholder='Name of the Letter'
                      variant='outlined'
                      fullWidth
                      size='small'
                      value={letterName}
                      error={isSubmitted && (letterName ? false : true)}
                      helperText={
                        isSubmitted && (letterName ? '' : 'Field is Mandatory')
                      }
                      onChange={event => {
                        if (event.target) {
                          setLetterName(event.target.value)
                        }
                      }}
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

                    <div className='d-flex align-items-center justify-content-center flex-wrap card-box MuiOutlinedInput-root MuiOutlinedInput-notchedOutline'>
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
                      Body of the Letter
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
                        onEditorStateChange(event)
                      }}
                    />
                    <p className='MuiFormHelperText-root MuiFormHelperText-contained Mui-error MuiFormHelperText-marginDense'>
                      {' '}
                      {isSubmitted && !editorState.getCurrentContent().hasText()
                        ? 'Field is Mandatory'
                        : ''}
                    </p>
                  </Grid>
                </Grid>
                <br></br> <br></br>
                <div className='divider' />
                <div className='divider' />
                <div className='w-100'>
                  <div className='float-right' style={{ marginRight: '2.5%' }}>
                    <Button
                      className='btn-primary mb-2 m-2'
                      type='submit'
                      onClick={e => save(e)}>
                      {saveButtonLabel}
                    </Button>
                    <Button
                      className='btn-primary mb-2 m-2'
                      component={NavLink}
                      to='./letters'>
                      Cancel
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
