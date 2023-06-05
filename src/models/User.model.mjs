export default class User {
  constructor({
    id,
    name,
    email,
    phone,
    city = null,
    state = null,
    type,
    cpf = null,
    date_of_birth = null,
    registered_by = null,
    status = null,
    position = null,
    permissions = [],
    implementer_id = null,
    password = null,
    password_recovery_code = null,
    code_first_access = null,
    implementer_name = null,
  }) {
    this._id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.city = city;
    this.state = state;
    this.type = type; // AGENT, ADMIN, FARMER
    this.cpf = cpf;
    this.date_of_birth = date_of_birth;
    this.registered_by = registered_by;
    this.status = status; // INACTIVE, ACTIVE
    this.position = position; // PROSPECTION, ENVIRONMENTAL_CONSULTING, ZOOTECHNICAL_CONSULTING, TRACEABILITY
    this.permissions = permissions;
    this.implementer_id = implementer_id;
    this.implementer_name = implementer_name;
    this.password = password;
    this.password_recovery_code = password_recovery_code;
    this.code_first_access = code_first_access;
    this.last_acess = null;
    this.createdAt = new Date();
  }
}
