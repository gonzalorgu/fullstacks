import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { Customer } from "./entities/customer.entity";

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  create(createCustomerDto: CreateCustomerDto) {
    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  findAll() {
    return this.customerRepository.find();
  }

  findOne(id: number) {
    return this.customerRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    await this.customerRepository.update(id, updateCustomerDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.customerRepository.delete(id);
    return { deleted: true };
  }
}
