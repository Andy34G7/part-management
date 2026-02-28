import { PostgresDropdownRepository, PostgresForm1Repository, PostgresForm2Repository } from './postgres';

// By instantiating here, we can easily swap them out later if the DB changes.
export const dropdownRepository = new PostgresDropdownRepository();
export const form1Repository = new PostgresForm1Repository();
export const form2Repository = new PostgresForm2Repository();
