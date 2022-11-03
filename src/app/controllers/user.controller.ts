import { UserService } from "@services";
import { Router, Request, Response } from "express";

export class UserController {
  public router: Router = Router()
  constructor(private userService: UserService) {
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
      const users = await this.userService.create({
        name,
        surname,
        role,
        email,
        plainPassword: password
      })
      res.send(users)
    })
    this.router.post('/recover-password', async (req:Request, res: Response) => { 
      const { email } = req.body
      // get user
      // create reset password token for user with expiration
      // send email with url containint reset-password-token
      return 
     })
    this.router.get('/validate-reset-password-token/:token', async (req: Request, rest: Response) => {
      const token = req.params.token
      // get reset password token
      // check if expiry date pasted
      // if not exists or expired return 400
      // else return 200
    })
    this.router.post('/reset-password', async (req:Request, res: Response) => { 
      const { token, password } = req.body // plain password
      // get user by token
      // hash new password
      // update user with hashed password
      return 
     })
  }
}

