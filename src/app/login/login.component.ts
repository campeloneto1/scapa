import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Session } from "../sistema/shared/session";
import { SessionService } from "../sistema/shared/session.service";
import { SharedModule } from "../sistema/shared/shared.module";
import { LoginService } from "./login.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: true,
    imports: [CommonModule,FormsModule, SharedModule]
})

export class LoginComponent implements OnInit{

    form!: FormGroup;

    constructor(
        private loginService: LoginService,
        private sessionService: SessionService,
        private router: Router,
        private formBuilder: FormBuilder
    ){
        
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            'cpf': ['', Validators.compose([
                Validators.required,
                Validators.minLength(11),
                Validators.maxLength(11)
            ])],
            'password': ['', Validators.compose([
                Validators.required,
                Validators.minLength(6),
            ])]
        });
    }

    entrar(){
        //console.log(this.form.value)
        
        this.loginService.entrar(this.form.value).subscribe({
            next: (data) => {
                //console.log(data);
                this.sessionService.setSession(data as Session);
                this.router.navigate([''])
            },
            error: (error) => {

            }
        });
    }
    
}