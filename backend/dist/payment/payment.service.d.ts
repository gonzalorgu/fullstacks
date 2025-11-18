import { Repository } from "typeorm";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { Payment } from "./entities/payment.entity";
import { User } from "../auth/entities/user.entity";
import { NotificationsGateway } from "../notifications/notifications.gateway";
export declare class PaymentService {
    private paymentRepository;
    private userRepository;
    private notificationsGateway;
    constructor(paymentRepository: Repository<Payment>, userRepository: Repository<User>, notificationsGateway: NotificationsGateway);
    create(createPaymentDto: CreatePaymentDto): Promise<Payment>;
    findAll(): Promise<Payment[]>;
    findAllWithUser(): Promise<Payment[]>;
    findById(id: string): Promise<Payment | null>;
    update(id: string, updatePaymentDto: Partial<CreatePaymentDto>): Promise<Payment>;
    delete(id: string): Promise<Payment>;
}
