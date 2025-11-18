import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header,  } from '../header/header';
import { Footer } from '../footer/footer';
import { WhatsappFloat } from "../../whatsapp-float/whatsapp-float";
import { Toast } from "../../../alert/toast/toast";
import { ConfirmDialog } from "../../../alert/confirm-dialog/confirm-dialog";

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Header, Footer, WhatsappFloat, Toast, ConfirmDialog],
  templateUrl: './shell.html',
  styleUrl: './shell.scss'
})
export class Shell {

}
