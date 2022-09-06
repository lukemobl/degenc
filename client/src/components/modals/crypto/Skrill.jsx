import React, { Fragment } from "react";
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Box from "@material-ui/core/Box"
import { makeStyles } from '@material-ui/core';

//assets
import qr from '../../../assets/qr.png';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 25,
        padding: '1rem',
        [theme.breakpoints.down('xs')]: {
            padding: 0,
            margin: 10,
        },
    },
    inputs: {
        display: 'flex',
        flexDirection: 'column',
        height: '10rem',
        justifyContent: 'space-around',
        marginTop: '25px',
        '& > div': {
            '& label': {
                color: "#e4e4e4",
                fontFamily: "Rubik",
                fontSize: "14px",
                fontWeight: 500,
                letterSpacing: ".1em",
            },
            '& label.Mui-focused': {
                color: '#e4e4e4',
            },
            '& .MuiInput-underline:after': {
                borderBottomColor: '#191b1e',
            },
            '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: '#191b1e',
                },
                '&:hover fieldset': {
                    borderColor: '#191b1e',
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#191b1e',
                },
            },
            '& > div > input': {
            }
        },
        '& > div > div': {
            background: '#191b1e !important',
        }
    },
    value: {
        position: 'relative',
        width: '100%',
        '& > div': {
            width: '100%',
            '& > div': {
                background: '#191b1e !important'
            },
            '& > div > input': {
                width: '70%',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }
        },
        Depvalue: {
            position: 'relative',
            width: '75%',
            [theme.breakpoints.down('sm')]: {
                width: '100%',
            },
            '& > div': {
                width: '100%',
                '& > div': {
                    background: '#191b1e !important'
                },
                '& > div > input': {
                    width: '70%',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }
            },
            '& button': {
                color: "#e4e4e4",
                fontFamily: "Rubik",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: ".1em",
                backgroundColor: "#264d68 !important",
                position: 'absolute',
                right: 0,
                top: '0.65rem',
                width: '6rem',
            }
        },
        '& button': {
            color: "#e4e4e4",
            fontFamily: "Rubik",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: ".1em",
            backgroundColor: "#264d68 !important",
            position: 'absolute',
            right: 0,
            top: '0.65rem',
            width: '6rem',
        }
    },
    withdraw: {
        color: "#e4e4e4",
        fontFamily: "Rubik",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: ".1em",
        backgroundColor: "#264d68 !important",
        width: '100%',
        marginTop: '1rem',
        height: '3rem',
    },
    qr: {
        position: 'absolute',
        width: 140,
        marginRight: '1rem',
        right: 0,
        top: 0,
        background: 'white',
        borderRadius: 5,
        padding: '0.5rem',
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        },
    }
}));


const Skrill = ({ deposit }) => {

    const classes = useStyles();

    return (
        <Box className={classes.root}>
            {deposit ? (
                <Fragment>
                    <Box>
                        Send your desired amount of Skrill to the following address.<br />
                        You will be credited after 5 minutes.
                        </Box>
                    <Box className={classes.inputs} style={{ height: 'auto', flexDirection: 'row', justifyContent: 'left' }}>
                        <Box className={classes.Depvalue}>
                            <TextField
                                label="Amount (Min. $1.00)"
                                variant="outlined"
                                color="#4F79FD"
                                value="0x7bf3a8F2E8d1EDe07aF342a6B16009B3899f0489"
                            />
                            <Button>COPY</Button>
                        </Box>
                        <img className={classes.qr} src={qr} alt="qr" />
                    </Box>
                </Fragment>
            ) : (
                    <Fragment>
                        <Box>
                            Withdraw your desired amount of Skrill to the following address.<br />
                            You will be credited after 5 minutes.
                        </Box>
                        <Box className={classes.inputs}>
                            <TextField
                                label="Your Bitcoin Address"
                                variant="outlined"
                                color="#4F79FD"
                            />
                            <Box className={classes.value}>
                                <TextField
                                    label="Amount (Min. $1.00)"
                                    variant="outlined"
                                    color="#4F79FD"
                                />
                                <Button>MAX</Button>
                            </Box>
                        </Box>

                        <Button className={classes.withdraw}>Request Withdrawal</Button>
                    </Fragment>
                )}
        </Box>
    );
};

export default Skrill;