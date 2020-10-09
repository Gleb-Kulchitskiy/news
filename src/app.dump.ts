import createError from 'http-errors'
import express, {Request, Response, NextFunction} from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import {indexRouter} from './routes'
import {usersRouter} from './routes/users'

interface Error {
    status?: number,
    message?: string
}

const appDump = express()

// view engine setup
appDump.set('views', path.join(__dirname, 'views'))
appDump.set('view engine', 'pug')

appDump.use(logger('dev'))
appDump.use(express.json())
appDump.use(express.urlencoded({extended: false}))
appDump.use(cookieParser())
appDump.use(express.static(path.join(__dirname, 'public')))

appDump.use('/', indexRouter)
appDump.use('/users', usersRouter)

// catch 404 and forward to error handler
appDump.use(function (req, res, next) {
    next(createError(404))
})

// error handler
appDump.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
});

export {appDump}
