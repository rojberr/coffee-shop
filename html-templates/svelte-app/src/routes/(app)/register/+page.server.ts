import { object, string, ref } from "yup";


export const prerender = false;

export const actions = {
    default: async ({ fetch, request }: { fetch: any, request: Request}) => {
        const formData = await request.formData();
        // const name = formData.get('name') as string;
        // const surname = formData.get('surname') as string;
        const email_address = formData.get('email_address') as string;
        const password = formData.get('password') as string;
		    const passwordConfirmation = formData.get('password2') as string;
        // const birthdate = formData.get('dateOfBirth') as string;
        // const sex = formData.get('sex') as number | null;

        // const inputDate: Date = new Date(birthdate);
        // const currentDate: Date = new Date();
        // currentDate.setHours(0, 0, 0, 0);

        // const created_at = new Date().toISOString();
        // const last_active = created_at;
        // const is_admin = 0;

        let emailExists: boolean = false;

        console.log(`Email: ${email_address}, password: ${password}`)

        try {
            const response = await fetch('/api/users/exists', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email_address: email_address }),
            });
      
            if (response.ok) {
              const result = await response.json();
              emailExists = result.emailExists;
            } else {
              console.error('Failed to check email existence');
            }
          } catch (error) {
            console.error('Error:', error);
        }

        console.log(`exists: ${emailExists}`);

        const registerFormSchema = object({
            email_address: string().required("Brak adresu e-mail.").email().test('email_check', "Adres email jest już zarejestrowany.", function(value) {
                return emailExists === false;
            }),
            password: string()
            .required('Brak hasła.') 
            .min(8, 'Hasło jest za krótkie - powinno mieć co najmniej 8 znaków.')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Hasło powinno zawierać małą i wielką literę oraz cyfrę.'),
            passwordConfirmation: string()
                .oneOf([ref('password'), undefined], 'Hasła muszą być takie same.')
        })

        try {
            const formValidationResult = await registerFormSchema.validate(
                { email_address, password, passwordConfirmation,  },
                { abortEarly: false }
            );
            
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email_address: email_address,
                    password: password }),
              });
        
              if (response.ok) {
                console.log('User successfully registered:', email_address);
                const result = await response.json();
                return { success: true, status: "User successfully registered.", data: result };
              } else {
                console.error('Failed to check email existence');
              }

            
            
        } catch (error: any) {
            console.error('Error adding user:', error);
            const errors = error.inner.reduce((acc: any, err: any) => {
                return { ...acc, [err.path]: err.message };
            }, {});

            return {
                errors,
                email_address,
                password,
                passwordConfirmation
            };
        }
    }
};