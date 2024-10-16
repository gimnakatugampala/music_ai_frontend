import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import clsx from 'clsx';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    makeStyles,
    OutlinedInput,
    TextField,
    Typography
} from '@material-ui/core';
import {Link} from 'react-router-dom';

import useScriptRef from '../../../../hooks/useScriptRef';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import Google from './../../../../assets/images/icons/social-google.svg';

import {strengthColor, strengthIndicator} from '../../../../utils/password-strength';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import SuccessToast from '../../../../ui-component/toast/SuccessToast';
import ErrorToast from '../../../../ui-component/toast/ErrorToast';
import { GoogleAuthUser, SignUpUser } from '../../../../api';
import BtnSpinner from '../../../../ui-component/spinner/BtnSpinner';





const useStyles = makeStyles((theme) => ({
    root: {},
    redButton: {
        fontSize: '1rem',
        fontWeight: 500,
        backgroundColor: theme.palette.grey[50],
        border: '1px solid',
        borderColor: theme.palette.grey[100],
        color: theme.palette.grey[600],
        textTransform: 'none',
        '&:hover': {
            backgroundColor: theme.palette.primary.light
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.875rem'
        }
    },
    signDivider: {
        flexGrow: 1
    },
    signText: {
        cursor: 'unset',
        margin: theme.spacing(2),
        padding: '5px 56px',
        borderColor: theme.palette.grey[100] + ' !important',
        color: theme.palette.grey[900] + '!important',
        fontWeight: 500
    },
    margin: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1)
    },
    forgot: {
        textDecoration: 'none'
    },
    loginIcon: {
        marginRight: '16px',
        [theme.breakpoints.down('sm')]: {
            marginRight: '8px'
        }
    },
    title: {
        color: theme.palette.grey[600]
    },
    login: {
        backgroundColor: theme.palette.purple.main,
        '&:hover': {
            backgroundColor: theme.palette.purple.dark
        }
    },
    loginput: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        '& > label': {
            top: '23px',
            left: 0,
            color: theme.palette.grey[500],
            '&[data-shrink="false"]': {
                top: '5px'
            }
        },
        '& > div > input': {
            padding: '30.5px 14px 11.5px !important'
        },
        '& legend': {
            display: 'none'
        },
        '& fieldset': {
            top: 0
        }
    },
    startAdornment: {
        color: theme.palette.grey[500],
        marginTop: '18px',
        width: 'auto'
    }
}));

const FirebaseRgister = ({className, ...rest}) => {
    const classes = useStyles();
    const scriptedRef = useScriptRef();
    const customization = useSelector((state) => state.customization);
    const [showPassword, setShowPassword] = React.useState(false);
    const [checked, setChecked] = React.useState(true);

    const [strength, setStrength] = React.useState(0);
    const [level, setLevel] = React.useState('');

    const [btnLoading, setbtnLoading] = useState(false)

  

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassowd = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
        // console.log(temp)
        // console.log(value)
    };

    useEffect(() => {
        changePassowd('');
    }, []);

    return (
        <React.Fragment>
           
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid mx={"auto"} item xs={12}>
                <GoogleLogin
                    size='large'
                    width={'50px'}
                    onSuccess={credentialResponse => {
                        const decoded = jwtDecode(credentialResponse?.credential);
                        console.log(decoded);

                        setbtnLoading(true)

                        let rawData = {
                            profile_img: decoded.picture,
                            first_name: decoded.given_name ==null ? "" : decoded.given_name,
                            last_name: decoded.family_name ==null ? "" : decoded.family_name,
                            email: decoded.email,
                            password: decoded.email
                        }

                        GoogleAuthUser(rawData,setbtnLoading)

                        // console.log(credentialResponse);

                    }}
                    onError={() => {
                        console.log('Login Failed');
                        setbtnLoading(false)
                        ErrorToast('Login Failed')
                    }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box alignItems="center" display="flex">
                        <Divider className={classes.signDivider} orientation="horizontal" />
                        <Button
                            variant="outlined"
                            className={classes.signText}
                            sx={{borderRadius: customization.borderRadius + 'px'}}
                            disableRipple
                            disabled
                        >
                            OR
                        </Button>
                        <Divider className={classes.signDivider} orientation="horizontal" />
                    </Box>
                </Grid>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box mb={2}>
                        <Typography variant="subtitle1" className={classes.title}>
                            Sign up with Email address
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    fname:'',
                    lname:'',
                    email: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    fname: Yup.string().max(255).required('First Name is required'),
                    lname: Yup.string().max(255).required('Last Name is required'),
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required')
                    })}
                    onSubmit={async (values, {setErrors, setStatus, setSubmitting}) => {
                        try {
                        
                        setbtnLoading(true)

                        console.log('Form Values:', values);
                        
                        if(strengthIndicator(values.password) < 4){
                            ErrorToast("Password is not strong enough")
                            return
                        }

                        if(checked == false){
                            ErrorToast("Please accept our terms & conditions")
                            return
                        }
                            

                        let rawData = {
                            profile_img:"",
                            first_name:values.fname,
                            last_name:values.lname,
                            email:values.email,
                            password:values.password
                        }

                        SignUpUser(rawData,setbtnLoading)



                    

                    } catch (err) {
                        console.error(err);
                    
                        ErrorToast("Something went wrong")
                    }
                }}
            >
                {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values}) => (
                    <form noValidate onSubmit={handleSubmit} className={clsx(classes.root, className)} {...rest}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    error={Boolean(touched.fname && errors.fname)}
                                    label="First Name"
                                    margin="normal"
                                    name="fname"
                                    type="text"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    inputProps={{
                                        classes: {
                                            notchedOutline: classes.notchedOutline
                                        }
                                    }}
                                    value={values.fname}
                                    variant="outlined"
                                    className={classes.loginput}
                                />
                                {touched.fname && errors.fname && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {' '}
                                    {errors.fname}{' '}
                                </FormHelperText>
                            )}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    error={Boolean(touched.lname && errors.lname)}
                                    label="Last Name"
                                    margin="normal"
                                    name="lname"
                                    type="text"
                                    value={values.lname}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    inputProps={{
                                        classes: {
                                            notchedOutline: classes.notchedOutline
                                        }
                                    }}
                                    variant="outlined"
                                    // className={classes.loginput}
                                />

                        {touched.lname && errors.lname && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {' '}
                                    {errors.lname}{' '}
                                </FormHelperText>
                            )}
                                
                            </Grid>
                        </Grid>
                        <FormControl
                            fullWidth
                            error={Boolean(touched.email && errors.email)}
                            className={classes.loginput}
                            variant="outlined"
                        >
                            <InputLabel htmlFor="outlined-adornment-email-register">Email Address / Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-register"
                                type="email"
                                // value={values.email}
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                labelWidth={70}
                                inputProps={{
                                    classes: {
                                        notchedOutline: classes.notchedOutline
                                    }
                                }}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {' '}
                                    {errors.email}{' '}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            className={classes.loginput}
                            variant="outlined"
                        >
                            <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-register"
                                type={showPassword ? 'text' : 'password'}
                                // value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    changePassowd(e.target.value);
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                labelWidth={70}
                                inputProps={{
                                    classes: {
                                        notchedOutline: classes.notchedOutline
                                    }
                                }}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                    {' '}
                                    {errors.password}{' '}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {strength !== 0 && (
                            <FormControl fullWidth>
                                <Box mb={2}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box width={85} height={8} borderRadius={7} backgroundColor={level.color}></Box>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </FormControl>
                        )}

                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={checked}
                                            onChange={(event) => setChecked(event.target.checked)}
                                            name="checked"
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <React.Fragment>
                                            <Typography variant="subtitle1">
                                                Agree with &nbsp;
                                                <Typography variant="subtitle1" component={Link} to="#">
                                                    Terms & Condition.
                                                </Typography>
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </Grid>
                        </Grid>
                        {errors.submit && (
                            <Box mt={3}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}
 
                        <Box mt={2}>
                            {btnLoading ? (
                                <Button
                                disableElevation
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                className={classes.login}
                                >
                                <BtnSpinner />
                                </Button>
                            ) : (
                            <Button
                                disableElevation
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                className={classes.login}
                            >
                                Sign up
                            </Button>
                            )}
                         
                        </Box>
                    </form>
                )}
            </Formik>
        </React.Fragment>
    );
};

export default FirebaseRgister;
