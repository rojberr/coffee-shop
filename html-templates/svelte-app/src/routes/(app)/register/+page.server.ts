import { object, string, number, date, ref, type ValidationError } from "yup";


export const prerender = false;

export const actions = {
    default: async ({ fetch, request }: { fetch: any, request: Request}) => {
        const formData = await request.formData();
        // const name = formData.get('name') as string;
        // const surname = formData.get('surname') as string;
        const username = formData.get('username') as string;
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

        let usernameExists: boolean = false;

        console.log(`Username: ${username}, password: ${password}`)

        try {
            const response = await fetch('/api/users/exists', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username: username }),
            });
      
            if (response.ok) {
              const result = await response.json();
              usernameExists = result.usernameExists;
            } else {
              console.error('Failed to check email existence');
            }
          } catch (error) {
            console.error('Error:', error);
        }

        console.log(`exists: ${usernameExists}`);

        const registerFormSchema = object({
            username: string().min(5, "Za krótka nazwa użytkownika.").required("Brak nazwy użytkownika."),
            password: string()
            .required('Brak hasła.') 
            .min(8, 'Hasło jest za krótkie - powinno mieć co najmniej 8 znaków.')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Hasło powinno zawierać małą i wielką literę oraz cyfrę.'),
            passwordConfirmation: string()
                .oneOf([ref('password'), undefined], 'Hasła muszą być takie same.')
        })

        try {
            const formValidationResult = await registerFormSchema.validate(
                { username, password, passwordConfirmation,  },
                { abortEarly: false }
            );
            
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username,
                    password: password }),
              });
        
              if (response.ok) {
                console.log('User successfully registered:', username);
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
                username,
                password,
                passwordConfirmation
            };
        }
    }
};