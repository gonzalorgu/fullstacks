import { Repository } from "typeorm";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { Customer } from "./entities/customer.entity";
export declare class CustomerService {
    private customerRepository;
    constructor(customerRepository: Repository<Customer>);
    create(createCustomerDto: CreateCustomerDto): Promise<Customer>;
    findAll(): Promise<Customer[]>;
    findOne(id: number): Promise<Customer | null>;
    update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer | null>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
}
