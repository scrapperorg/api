import { UserService } from "@services";
import { Router, Request, Response } from "express";
// import Router from 'express-promise-router'

export class UserController {
  public router = Router()
  constructor(private userService: UserService) {
    this.router.get('/', async (req: Request, res: Response) => {
      const users = await this.userService.getAllUsers()
      res.send(users)
    })
  }
}

