---
name: "api"
root: "."
output: "**/*"
ignore: []
questions:
  name:
    message: "Please enter name of entity."
    initial: "Product"
  fields:
    message: "Please enter the fields with its respective type."
    initial: "string name, int quantity, decimal price"
---

# `../api/prisma/schema.prisma`

```prisma

  {{read output.abs}}

  model {{inputs.name}} {
    id   String @id @default(uuid())
    {{prismaModel inputs.fields}}
  }
```

# `../api/src/common/pagination-query.dto.ts`

```typescript
import { Exclude, Type } from "class-transformer";
import { IsInt, IsObject, IsOptional } from "class-validator";

export function getPaginationQueryData<T>(
  paginationQueryDto: PaginationQueryDto<T>
) {
  return {
    take: paginationQueryDto.take ?? paginationQueryDto.limit,
    skip: paginationQueryDto.skip,
    orderBy: paginationQueryDto.sort,
  };
}

export abstract class PaginationQueryDto<T> {
  @IsOptional()
  @IsInt({
    message: "'skip' must be a number",
  })
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  @IsInt({
    message: "'take' must be a number",
  })
  @Type(() => Number)
  take?: number;

  @IsOptional()
  @IsInt({
    message: "'limit' must be a number",
  })
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsObject({
    message: "'sort' sort must be an object",
  })
  sort?: T;

  @Exclude()
  page?: number;
}
```

# `../api/src/prisma/prisma.service.ts`

```typescript
import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }
}
```

# `../api/src/prisma/prisma.module.ts`

```typescript
import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

# `../api/src/{{generateName inputs.name}}/dto/create-{{generateName inputs.name}}.dto.ts`

```typescript

export class Create{{inputs.name}}Dto{

}

```

# `../api/src/{{generateName inputs.name}}/dto/find-all-{{generateName inputs.name}}s.dto.ts`

```typescript

export class FindAll{{inputs.name}}sDto{
  //Here you will put the types with class validation
}

```

# `../api/src/{{generateName inputs.name}}/dto/update-{{generateName inputs.name}}s.dto.ts`

```typescript

export class Update{{inputs.name}}Dto{
  //Here you will put the types with class validation
}

```

# `../api/src/{{generateName inputs.name}}/entities/{{generateName inputs.name}}.entity.ts`

```typescript

export class {{inputs.name}}Entity{
  //Here you will put the types with class validation
}

```

# `../api/src/{{generateName inputs.name}}/services/{{generateName inputs.name}}.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { getPaginationQueryData } from '../../common/pagination-query.dto';

@Injectable()
export class {{inputs.name}}Service{
  constructor(
    private readonly prismaService:PrismaService,
  ){}

  async create(data:Create{{inputs.name}}Dto){
    const {{lower inputs.name}} = await this.prismaService.{{lower inputs.name}}.create({
      data
    });

    return new {{inputs.name}}Entity({{lower inputs.name}});
  }

  async findAll({...query}:FindAll{{inputs.name}}sDto){
    const where:Prisma.{{inputs.name}}WhereInput ={
      //Here you will put the values that are in the FindAllDto
    }

    const totalCount = await this.prismaService.{{lowerFirst inputs.name}}.count({where})

    const {{lowerFirst inputs.name}}s = await this.prismaService.{{lowerFirst inputs.name}}.findMany({
      ...getPaginationQueryData(query),
      orderBy:query.sort,
      where,
    });

    const entities = {{lowerFirst inputs.name}}s.map(({{lowerFirst inputs.name}})=> new {{inputs.name}}Entity({{lowerFirst inputs.name}}),);

    return{
      totalCount,
      entities,
    };
  }

  async findOne(id:string){
    const {{lowerFirst inputs.name}} = await this.prismaService.{{lowerFirst inputs.name}}.findUnique({
      where:{ id },
    });

    if(!{{lowerFirst inputs.name}}){
      throw new NotFoundException(`{{inputs.name}} with id ${id} not found`);
    }

    return new {{inputs.name}}Entity({{lowerFirst inputs.name}});
  }

  async update(id:string, data:Update{{inputs.name}}Dto){
    const updated{{inputs.name}} = await this.prismaService.{{lowerFirst inputs.name}}.update({
      where:{ id },
      data,
    });

    return new {{inputs.name}}Entity(updated{{inputs.name}});
  }

  remove(id:string){
    return this.prismaService.{{lowerFirst inputs.name}}.delete({where: { id }});
  }
}

```

# `../api/src/{{generateName inputs.name}}/controllers/{{generateName inputs.name}}.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { {{inputs.name}}Service } from '../services/{{generateName inputs.name}}.service';
import { Create{{inputs.name}}Dto } from '../dto/create-{{generateName inputs.name}}.dto';
import { Update{{inputs.name}}Dto } from '../dto/update-{{generateName inputs.name}}.dto';
import { FindAll{{inputs.name}}Dto } from '../dto/find-all-{{generateName inputs.name}}.dto';

@Controller('{{generateName inputs.name}}')
export class {{inputs.name}}Controller{
  constructor(private readonly {{lowerFirst inputs.name}}Service: {{inputs.name}}Service){}


  @Post()
  create(@Body() create{{inputs.name}}Dto: Create{{inputs.name}}Dto) {
    return this.{{lowerFirst inputs.name}}sService.create(create{{inputs.name}}Dto);
  }

  @Get()
  findAll(@Query() query: FindAll{{inputs.name}}sDto) {
    return this.{{lowerFirst inputs.name}}sService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.{{lowerFirst inputs.name}}sService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() update{{inputs.name}}Dto: Update{{inputs.name}}Dto,
  ) {
    return this.{{lowerFirst inputs.name}}sService.update(id, update{{inputs.name}}Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.{{lowerFirst inputs.name}}sService.remove(id);
  }
}
```

# `../api/src/{{generateName inputs.name}}/{{generateName inputs.name}}.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { {{inputs.name}}Service } from './services/{{generateName inputs.name}}.service';
import { {{inputs.name}}Controller } from './controllers/{{generateName inputs.name}}.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [{{inputs.name}}Controller],
  providers: [{{inputs.name}}Service],
  exports: [{{inputs.name}}Service],
})
export class {{inputs.name}}Module {}
```

# `../api/src/{{generateName inputs.name}}/tests/{{generateName inputs.name}}.service.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { {{inputs.name}}Service } from '../services/{{generateName inputs.name}}.service';

describe('{{inputs.name}}Service', () => {
  let service: {{inputs.name}}Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{{inputs.name}}Service],
    }).compile();

    service = module.get<{{inputs.name}}Service>({{inputs.name}}Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

```

# `../api/src/{{generateName inputs.name}}/tests/{{generateName inputs.name}}.controller.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { {{inputs.name}}Controller } from '../controllers/{{generateName inputs.name}}.controller';
import { {{inputs.name}}Service } from '../services/{{generateName inputs.name}}.service';

describe('{{inputs.name}}Controller', () => {
  let controller: {{inputs.name}}Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers:[{{inputs.name}}Controller],
      providers: [{{inputs.name}}Service],
    }).compile();

    controller = module.get<{{inputs.name}}Controller>({{inputs.name}}Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

```
