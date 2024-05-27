import { EntityManager } from 'typeorm';
import { BaseContext } from './base.type';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/auth/guard/auth.guard';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable({ scope: Scope.REQUEST })
export class BaseService {
  protected manager: EntityManager;
  protected context: BaseContext;

  constructor(
    @InjectEntityManager() entityManager: EntityManager,
    @Inject(REQUEST) private readonly request: CustomRequest,
  ) {
    this.manager = entityManager;
    this.context = this.request;
  }
}
