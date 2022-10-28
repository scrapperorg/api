import { UserService } from "@services";
import { Router, Request, Response } from "express";

export class UserController {
  public router = Router()
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
      const { id, name, surname, role } = req.body;
      const users = await this.userService.create({
        id,
        name,
        surname,
        role, 
      })
      res.send(users)
    })
  }
}

