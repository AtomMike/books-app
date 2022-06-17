import React, { Component, useEffect, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems, secondaryListItems } from './dashboard/listItems';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';

import Axios from 'axios'

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


const Books = ({books}) => {
  
  const [booksList, setBooksList] = React.useState([])
  const [openModal, setOpenModal] = React.useState(false)
  const [openNewBookDialogue, setOpenNewBookDialogue] = React.useState(false)
  const [openEditBookDialogue, setOpenEditBookDialogue] = React.useState(false)
  const [open, setOpenDrawer] = React.useState(true)
  const [current_book, setBook] = React.useState([{
    'author': {
      'name': ''
    }
  }])
  const [current_book_author, setBookAuthor] = React.useState({})
  const [edit_book, setEditBook] = React.useState([{
    'author': {
      'name': ''
    }
  }])
  const [edit_book_author, setEditBookAuthor] = React.useState({})

  const [newBookName, setnewBookName] = React.useState('')
  const [newBookISBN, setnewBookISBN] = React.useState('')
  const [newBookDate, setnewBookDate] = React.useState(null)
  const [newBookAuthorId, setnewBookAuthorId] = React.useState(null)

  const [editBookName, setEditBookName] = React.useState('')
  const [editBookISBN, setEditBookISBN] = React.useState('')
  const [editBookDate, setEditBookDate] = React.useState('')
  const [editBookId,   setEditBookId] = React.useState('')
  const [editBookAuthorId, setEditBookAuthorId] = React.useState('')

  const toggleDrawer = () => {
    setOpenDrawer(!open)
  }

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);


  const moreInfoBook = (data) => {
    fetchBook(data.id)
    setOpenModal(true)
  }

  const addBookModal = () => {
    setOpenNewBookDialogue(true)
  }
  const editBookModal = (data) => {
    fetchBookToEdit(data.id)
    setEditBookId(data.id)
    setOpenEditBookDialogue(true)
  }
  const closeDialogue = () => {
    setOpenNewBookDialogue(false)
    setOpenEditBookDialogue(false)
  }
  const addBookAction = () => {
    setOpenNewBookDialogue(false)
    createBook()
  }
  const editBookAction = () => {
    setOpenEditBookDialogue(false)
    console.log('editBookId ',editBookId)
    updateBook(editBookId)
  }

  const formatDate = (date) => {
    let d = new Date(date);
    let month = (d.getMonth() + 1).toString();
    let day = d.getDate().toString();
    let year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }
  // console.log(formatDate('Febuary 1, 2021'));


  const changeTitle = (value) => {
    setnewBookName(value.target.value)
  }
  const changeISBN = (value) => {
    setnewBookISBN(value.target.value)
  }
  const changeDate = (value) => {
    setnewBookDate(value.target.value)
  }
  const changeAuthorId = (value) => {
    setnewBookAuthorId(value.target.value)
  }


  const changeEditTitle = (value) => {
    setEditBookName(value.target.value)
  }
  const changeEditISBN = (value) => {
    setEditBookISBN(value.target.value)
  }
  const changeEditDate = (value) => {
    setEditBookDate(value.target.value)
  }
  const changeEditAuthorId = (value) => {
    setEditBookAuthorId(value.target.value)
  }

  React.useEffect(() => {
  }, [editBookId])  

  React.useEffect(() => {
    // Grab initial Books list
    fetchBooks()
  }, [])


  const renderDetailButton = (params) => {
    return (
        <strong>
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                    moreInfoBook(params.row)
                }}
            >
                View
            </Button>
        </strong>
    )
  }
  const renderEditButton = (params) => {
    return (
        <strong>
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  editBookModal(params.row)
                }}
            >
                Edit
            </Button>
        </strong>
    )
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'isbn', headerName: 'ISBN', width: 150 },
    { field: 'datePublished', headerName: 'Date Published', width: 130 },
    { field: 'authorId', headerName: 'Author ID', type: 'string', width: 90 },
    { field: 'moreInfo',
      headerName: ' ',
      width: 100,
      renderCell: renderDetailButton
    },
    { field: 'update',
      headerName: ' ',
      width: 100,
      renderCell: renderEditButton
    }
  ];



  const fetchBooks = async () => {
    const res = await Axios.get('/books')
    .then((res) => {
      setBooksList(res.data.books)
    })
  }
  const fetchBook = async (id) => {
    const res = await Axios.get('/book/'+id)
    .then((res) => {
      setBook(res.data)
      setBookAuthor(res.data.author)
    })
  }
  const fetchBookToEdit = async (id) => {
    const res = await Axios.get('/book/'+id)

    .then((res) => {
      setEditBook(res.data)
      setEditBookId(id)
      setEditBookName(res.data.name)
      setEditBookISBN(res.data.ISBN)
      setEditBookDate(formatDate(res.data.datePublished))
      setEditBookAuthor(res.data.author)
      setEditBookAuthorId(res.data.author.id)
    })
  }
  const createBook = async (id) => {
    const res = await Axios.post('/book', {
      isbn:newBookISBN,
      name:newBookName,
      datePublished:newBookDate,
      authorId:newBookAuthorId
    })
    .then((res) => {
      console.log('Successfully created a new book entry')
    })
  }
  const updateBook = async (id) => {
    // console.log(editBookId, editBookName, editBookISBN, editBookDate, editBookAuthorId)

    const res = await Axios.put('/book/'+editBookId, {
      isbn:editBookISBN,
      name:editBookName,
      datePublished:editBookDate,
      authorId:editBookAuthorId
    })
    .then((res) => {
      console.log('Successfully updated a book entry')
    })
  }

  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: theme.spacing(7),
          [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
          },
        }),
      },
    }),
  )

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  const mdTheme = createTheme();
  
  return (
    <ThemeProvider theme={mdTheme}>
      
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {current_book.name}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            By {current_book_author.name}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            ISBN {current_book.ISBN}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Published {current_book.datePublished}
          </Typography>
        </Box>
      </Modal>

      <Dialog open={openEditBookDialogue} onClose={closeDialogue}>
        <DialogTitle>Edit Book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit the below fields to update this book
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Title"
            type="text"
            value={editBookName}
            fullWidth
            variant="standard"
            onChange={changeEditTitle}
          />
          <TextField
            autoFocus
            margin="dense"
            id="authorId"
            label="Author ID"
            type="number"
            value={editBookAuthorId}
            fullWidth
            variant="standard"
            onChange={changeEditAuthorId}
          />
          <TextField
            autoFocus
            margin="dense"
            id="isbn"
            label="ISBN"
            type="text"
            value={editBookISBN}
            fullWidth
            variant="standard"
            onChange={changeEditISBN}
          />
          <TextField
            autoFocus
            margin="dense"
            id="date"
            type="date"
            value={editBookDate}
            fullWidth
            variant="standard"
            onChange={changeEditDate}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialogue}>Cancel</Button>
          <Button onClick={editBookAction}>Submit</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={openNewBookDialogue} onClose={closeDialogue}>
        <DialogTitle>Add New Book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the new book's details below, to add it to the database
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            onChange={changeTitle}
          />
          <TextField
            autoFocus
            margin="dense"
            id="authorId"
            label="Author ID"
            type="number"
            fullWidth
            variant="standard"
            onChange={changeAuthorId}
          />
          <TextField
            autoFocus
            margin="dense"
            id="isbn"
            label="ISBN"
            type="text"
            fullWidth
            variant="standard"
            onChange={changeISBN}
          />
          <TextField
            autoFocus
            margin="dense"
            id="date"
            type="date"
            fullWidth
            variant="standard"
            onChange={changeDate}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialogue}>Cancel</Button>
          <Button onClick={addBookAction}>Submit</Button>
        </DialogActions>
      </Dialog>
      

      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            
          </Toolbar>
        </AppBar>


        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>



        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />

          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>

              <Grid item xs={12} md={12} lg={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 600,
                  }}
                >
                  <DataGrid
                    rows={booksList}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                  />
                  <Button 
                    variant="contained"
                    color="primary"
                    size="small" 
                    onClick={addBookModal}>
                    Add new book
                  </Button>

                </Paper>
              </Grid>

            </Grid>

          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );

}

export default Books