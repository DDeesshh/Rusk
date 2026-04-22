ALTER TABLE reservations
  ADD COLUMN confirmation_token VARCHAR(255) NULL,
  ADD COLUMN confirmation_sent_at DATETIME NULL,
  ADD COLUMN reminder_sent TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN is_confirmed_by_user TINYINT(1) NULL;

CREATE INDEX idx_reservations_date_status ON reservations(date, status);
CREATE INDEX idx_reservations_email ON reservations(email);
CREATE UNIQUE INDEX uq_reservations_confirmation_token ON reservations(confirmation_token);
