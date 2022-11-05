import { UserService, ResetPasswordService } from './../services';
import { Router, Request, Response } from "express";

export class UserController {
  public router: Router = Router()
  constructor(
    private readonly userService: UserService,
    private readonly resetPasswordService: ResetPasswordService
  ) {
    this.router.get('/', async (req: Request, res: Response) => {
      const users = await this.userService.getAll()
      res.send(users)
    })
    this.router.get('/:id', async (req: Request, res: Response) => {
      const user = await this.userService.getById(req.params.id)
      res.send(user)
    })
    this.router.post('/create', async (req: Request, res: Response) => {
      const { name, surname, role, password, email } = req.body;
      console.log(name)
      const result = await this.userService.create({
        name,
        surname,
        role,
        email,
        plainPassword: password
      })
      if ( result === true ) return res.send(200)
      return res.status(500).send(result)
    })
    this.router.post('/recover-password', async (req:Request, res: Response) => { 
      const { email } = req.body
      this.resetPasswordService.generateResetPasswordToken(email)
      res.send('insert response')
    })
    this.router.get('/validate-reset-password-token/:token', async (req: Request, res: Response) => {
      const token = req.params.token
      this.resetPasswordService.validateResetPasswordToken()
      res.send('insert response')
    })
    this.router.post('/reset-password', async (req:Request, res: Response) => { 
      const { token, password } = req.body // plain password
      this.resetPasswordService.resetUserPassword()
      res.send('insert response')
    })
  }
}

